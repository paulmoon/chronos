from rest_framework import serializers
from django.core.exceptions import ValidationError
from rest_framework.authtoken.models import Token
import app

##############################
# --------- Users! --------- #
##############################
class ChronosUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = app.models.ChronosUser
        fields = ('id', 'first_name', 'last_name', 'username', 'email', 'userType')

class ChronosUserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = app.models.ChronosUser
        fields = ('id', 'username', 'password', 'email', 'first_name', 'last_name', 'userType')

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
        token, created = Token.objects.get_or_create(user=user)
        return token, created, user


    def update(self, instance, validated_data):
        instance.password = validated_data.get('password', instance.password)
        instance.email = validated_data.get('email', instance.email)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.save()
        return instance

    def validate_username(self, value):
        """
        Ensure that the username doesn't already exist
        """
        if app.models.ChronosUser.objects.filter(username=value).exists():
            raise serializers.ValidationError("username")
        return value

    def validate_email(self, value):
        """
        Ensure that the email doesn't already exist
        """
        if app.models.ChronosUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("email");
        return value

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = app.models.Tag
        fields = ('id', 'name')

    def validate_name(self, value):
        """
        Ensure that the name is unique as well
        """
        if app.models.Tag.objects.filter(name=value).exists():
            raise serializers.ValidationError("name")
        return value

##############################
# --------- Events! -------- #
##############################
class EventWriteSerializer(serializers.ModelSerializer):
    class Meta: 
        model = app.models.Events
        fields = ('id', 'title', 'description', 'creator', 'picture', "comment_id", "create_date", "edit_date" , "start_date", "end_date", "vote", "report", "is_deleted", "place_id", "tags")

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
        for tag in tags:
            event.tags.add(tag)
        return event

    def update(self, instance, validated_data):
        """
        Only update the fields that are necessary
        """
        instance.title = validated_data.get('title', instance.title)
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
    class Meta: 
        model = app.models.Events
        fields = ('id', 'title', 'description', 'creator', 'picture', "comment_id", "create_date", "edit_date" , "start_date", "end_date", "vote", "report", "is_deleted", "place_id", "tags")