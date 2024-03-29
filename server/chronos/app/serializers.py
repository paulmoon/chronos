from rest_framework import serializers
from rest_framework.authtoken.models import Token
from chronos.settings import MEDIA_URL

from urlparse import urlparse
import app


##############################
# --------- Users! --------- #
##############################


class ChronosPublicUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = app.models.ChronosUser
        fields = ('id', 'username',)

class SimpleEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = app.models.Events
        fields = ('id', 'name',)

class EventIdSerializer(serializers.ModelSerializer):
    class Meta:
        model = app.models.Events
        fields = ('id',)

class SimpleVoteSerializer(serializers.ModelSerializer):
    event = EventIdSerializer()
    direction = serializers.IntegerField(min_value=-1, max_value=1)

    class Meta:
        model = app.models.Vote
        fields = ('event', 'direction',)

class ChronosUserSerializer(serializers.ModelSerializer):
    saved_events = EventIdSerializer(many=True)
    reported_events = serializers.SerializerMethodField()
    voted_events = serializers.SerializerMethodField()

    class Meta:
        model = app.models.ChronosUser
        fields = ('id', 'first_name', 'last_name', 'username', 'email', 'userType', 'place_id', 'place_name', 'saved_events', 'reported_events', 'voted_events',)

    def get_reported_events(self, obj):
        return [SimpleReportSerializer(report).data for report in app.models.Reports.objects.filter(user=obj.id)]

    def get_voted_events(self, obj):
        return [SimpleVoteSerializer(v).data for v in app.models.Vote.objects.filter(user=obj.id)]

class ChronosUserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = app.models.ChronosUser
        fields = ('id', 'username', 'password', 'email', 'first_name', 'last_name', 'userType', 'place_id', 'place_name')

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
            raise serializers.ValidationError("Email already exists")
        return value

class ChronosUserUpdateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(max_length=128, required=False)
    class Meta:
        model = app.models.ChronosUser
        fields = ('id', 'password', 'email', 'first_name', 'last_name', 'place_id', 'place_name')

    def validate_email(self, value):
        """
        Ensure that the email doesn't already exist
        """
        if app.models.ChronosUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value

    def update(self, instance, validated_data):
        if validated_data.get('password'):
            instance.set_password('password')
        instance.email = validated_data.get('email', instance.email)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.place_id = validated_data.get('place_id', instance.place_id)
        instance.place_name = validated_data.get('place_name', instance.place_name)
        instance.save()
        return instance

##############################
# --------- Other! --------- #
##############################
class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = app.models.Tag
        fields = ('name','usage')

class TagEventSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)

class ImageUrlField(serializers.ImageField):
    """
    Django Rest Framework returns the url to the image, but it assumes that
    the called url is the top level url. So, it will append the MEDIA_URL to the
    caller url rather than the top level domain as expected. This is due to the way
    that request.build_absolute_uri works in Django at the moment.

    To fix this, we need to rip out the top level domain, and rebuild the url the way
    we want. To rip out the top level domain, I found the following code on
    stack overflow: http://stackoverflow.com/questions/9626535/get-domain-name-from-url
    """

    def to_representation(self, value):
        invalid_url = super(serializers.ImageField, self).to_representation(value)
        parsed_uri = urlparse(invalid_url)
        domain = '{uri.scheme}://{uri.netloc}/'.format(uri=parsed_uri)
        return domain + MEDIA_URL + str(value)

class ImageReadSeralizer(serializers.ModelSerializer):
    image = ImageUrlField()
    class Meta:
        model = app.models.Image
        fields = ('image', )

#https://medium.com/@jxstanford/django-rest-framework-file-upload-e4bc8de669c0
class ImageWriteSerializer(serializers.HyperlinkedModelSerializer):
    owner = serializers.SlugRelatedField(read_only=True, slug_field='id')
    image = ImageUrlField()
    class Meta:
        model = app.models.Image
        fields = ('id', 'created', 'image', 'owner',)

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

    def validate(self, data):
        if data['start_date'] >= data['end_date']:
            raise serializers.ValidationError('Start date is greater than the end date');
        return data

    def create(self, validated_data):
        # Tags is a many to may field in the Event model, and therefore cannot be created through the objects.create method
        tags = validated_data["tags"]
        validated_data.pop("tags", None)
        event = app.models.Events.objects.create(**validated_data)

        # Get all the tags that already exist
        tag_names = [tag["name"] for tag in tags]
        existing_tag_queryset = app.models.Tag.objects.filter(name__in=tag_names)

        for tag in existing_tag_queryset:
            tag.usage += 1
            tag.save()

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
    picture = ImageReadSeralizer()
    class Meta: 
        model = app.models.Events
        fields = ('id', 'name', 'description', 'creator', "create_date", "edit_date" , "start_date", "end_date", "vote", "upvote", "downvote", "report", "is_deleted", "picture", "place_id", "place_name", "tags")

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

class ReportEventSerializer(serializers.Serializer):
    reason = serializers.CharField(max_length=20, required=True)

    class Meta:
        model = app.models.Reports
        fields = ('reason', 'event', 'user',)

    def create(self, validated_data):
        report = app.models.Reports.objects.create(**validated_data)
        report.save()
        
        return report

    def update(self, instance, validated_data):
        reason = validated_data.get('reason')
        if reason is not None and instance.reason != reason:
            instance.reason = reason
            instance.save()

        return instance

class SimpleReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = app.models.Reports
        fields = ('reason', 'event')

##############################
# --------- Comments! ------ #
##############################

class RecursiveField(serializers.Serializer):

    def to_representation(self, value):
        serializer = self.parent.parent.__class__(value, context=self.context)
        return serializer.data



class CommentReadSerializer(serializers.ModelSerializer):
    children = RecursiveField(many=True)
    user = ChronosPublicUserSerializer()

    class Meta:
        model = app.models.Comments
        fields = ('id', 'content', 'event', 'user', 'date', 'depth', 'path', 'children')

class CommentWriteSerializer(serializers.ModelSerializer):

    class Meta:
        model = app.models.Comments
        fields = ('id', 'content', 'event', 'user', 'date', 'depth', 'path', 'parent')

    def __init__(self, *args, **kwargs):
        fields = kwargs.pop('fields', None)
        super(serializers.ModelSerializer, self).__init__(*args, **kwargs)
        if fields:
            allowed = set(fields)
            existing = set(self.fields.keys())
            for field_name in existing - allowed:
                self.fields.pop(field_name)


    def create(self, validated_data):
        comment = app.models.Comments.objects.create(**validated_data)
        comment.save()
        return comment
