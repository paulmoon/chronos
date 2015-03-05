from rest_framework import serializers
from django.core.exceptions import ValidationError
from rest_framework.authtoken.models import Token
import app

##############################
# --------- Users! --------- #
##############################


class ChronosPublicUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = app.models.ChronosUser
        fields = ('id', 'username', )

class SimpleEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = app.models.Events
        fields = ('id', 'name',)

class ChronosUserSerializer(serializers.ModelSerializer):
    saved_events = SimpleEventSerializer(many=True)
    class Meta:
        model = app.models.ChronosUser
        fields = ('id', 'first_name', 'last_name', 'username', 'email', 'userType', 'place_id', 'saved_events')

class ChronosUserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = app.models.ChronosUser
        fields = ('id', 'username', 'password', 'email', 'first_name', 'last_name', 'userType', 'place_id')

    def __init__(self, *args, **kwargs):
        fields = kwargs.pop('fields', None)
        super(serializers.ModelSerializer, self).__init__(*args, **kwargs)
        if fields:
            allowed = set(fields)
            existing = set(self.fields.keys())
            for field_name in existing - allowed:
                self.fields.pop(field_name)

    def create(self, validated_data):
        user = app.models.ChronosUser.objects.create(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        token, created = Token.objects.get_or_create(user=user)
        return token, created, user

    def validate_username(self, value):
        """
        Ensure that the username doesn't already exist
        """
        if app.models.ChronosUser.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists")
        return value

    def validate_email(self, value):
        """
        Ensure that the email doesn't already exist
        """
        if app.models.ChronosUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists");
        return value

class ChronosUserUpdateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(max_length=128, required=False)
    class Meta:
        model = app.models.ChronosUser
        fields = ('id', 'password', 'email', 'first_name', 'last_name', 'place_id')

    def validate_email(self, value):
        """
        Ensure that the email doesn't already exist
        """
        if app.models.ChronosUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists");
        return value

    def update(self, instance, validated_data):
        if validated_data.get('password'):
            instance.set_password('password')
        instance.email = validated_data.get('email', instance.email)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.place_id = validated_data.get('place_id', instance.place_id)
        instance.save()
        return instance

##############################
# --------- Other! --------- #
##############################
class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = app.models.Tag
        fields = ('name',)

class TagEventSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)

##############################
# --------- Events! -------- #
##############################
class EventWriteSerializer(serializers.ModelSerializer):
    tags = TagEventSerializer(many=True, required=False)
    class Meta: 
        model = app.models.Events
        fields = ('id', 'name', 'description', 'creator', 'picture', "create_date", "edit_date" , "start_date", "end_date", "report", "is_deleted", "place_id", "place_name", "tags")

    def __init__(self, *args, **kwargs):
        fields = kwargs.pop('fields', None)          
        super(serializers.ModelSerializer, self).__init__(*args, **kwargs)
        if fields:
            allowed = set(fields)
            existing = set(self.fields.keys())
            for field_name in existing - allowed:
                self.fields.pop(field_name)

    def create(self, validated_data):
        # Tags is a many to may field in the Event model, and therefore cannot be created through the objects.create method
        tags = validated_data["tags"]
        validated_data.pop("tags", None)
        event = app.models.Events.objects.create(**validated_data)

        # Get all the tags that already exist
        tag_names = [tag["name"] for tag in tags]
        existing_tag_queryset = app.models.Tag.objects.filter(name__in=tag_names)        

        # Get all the tags that don't exist in the DB yet, and create them in bulk
        missing_tag_names = filter(lambda x: x not in [e.name for e in existing_tag_queryset], tag_names)

        #TODO: Attempt to get the bulk create working. It is inefficient to create in a list like this. The problem is that 
        # bulk_create will not call save, meaning all newly created Tags will not be in the database quite yet
        #missing_tags = app.models.Tag.objects.bulk_create([app.models.Tag(name=missing_tag_name) for missing_tag_name in missing_tag_names])
        missing_tags = [app.models.Tag.objects.create(name=missing_tag_name) for missing_tag_name in missing_tag_names]

        # Add the tag object to our newly created event
        tag_objs = list(existing_tag_queryset) + missing_tags
        for tag_obj in tag_objs:
            event.tags.add(tag_obj)
        return event

    def update(self, instance, validated_data):
        """
        Only update the fields that are necessary
        """
        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        instance.picture = validated_data.get('picture', instance.picture)
        instance.start_date = validated_data.get('start_date', instance.start_date)
        instance.end_date = validated_data.get('end_date', instance.end_date)
        instance.edit_date = validated_data.get('edit_date', instance.edit_date)
        instance.place_id = validated_data.get('place_id', instance.place_id)
        instance.save()
        return instance

class EventReadSerializer(serializers.ModelSerializer):
    """
    This is because it's almost impossible to pull all the information about a tag only when doing a read operation
    using one central event serializer. It became necessary to split them up into a write serializer, and a read serializer to
    allow the writing of events using only the foreign keys of tags.
    """
    tags = TagSerializer(many=True)
    vote = serializers.SerializerMethodField()
    creator = ChronosPublicUserSerializer()
    class Meta: 
        model = app.models.Events
        fields = ('id', 'name', 'description', 'creator', 'picture', "create_date", "edit_date" , "start_date", "end_date", "vote", "report", "is_deleted", "place_id", "place_name", "tags")

    def get_vote(self, obj):
        return obj.upvote - obj.downvote

class VoteEventSerializer(serializers.Serializer):
    direction = serializers.IntegerField(min_value=-1, max_value=1)

    class Meta:
        model = app.models.Vote
        fields = ('direction', 'event', 'user')

    def create(self, validated_data):
        vote = app.models.Vote.objects.create(**validated_data)
        vote.save()
        event = validated_data['event']
        direction = validated_data['direction']
        if direction == 1:
            event.upvote += 1
        elif direction == -1:
            event.downvote += 1
        
        event.save()
        return vote

    def update(self, instance, validated_data):
        direction = validated_data.get('direction')
        event = validated_data['event']
        if direction is not None and instance.direction != direction:
            if instance.direction == 1:
                event.upvote -= 1
            elif instance.direction == -1:
                event.downvote -= 1

            if direction == 1:
                event.upvote += 1
            elif direction == -1:
                event.downvote += 1

            event.save()
            instance.direction = direction
            instance.save()

        return instance