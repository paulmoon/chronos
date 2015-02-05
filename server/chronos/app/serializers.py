from rest_framework import serializers
from django.core.exceptions import ValidationError
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

    def validate_username(self, value):
        """
        Ensure that the username doesn't already exist
        """
        if app.models.ChronosUser.objects.filter(username=attrs[value]).exists():
            raise serializers.ValidationError("username")
        return value

    def validate_email(self, value):
        """
        Ensure that the email doesn't already exist
        """
        if app.models.ChronosUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("email");
        return value

##############################
# --------- Events! -------- #
##############################
class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = app.models.Events
        fields = ('id', 'title', 'description', 'creator', 'picture', "comment_id", "start_date", "end_date", "vote", "report", "is_deleted", "place_id")

        def __init__(self, *args, **kwargs):
            fields = kwargs.pop('fields', None)
            
            super(serializers.ModelSerializer, self).__init__(*args, **kwargs)

            if fields:
                allowed = set(fields)
                existing = set(self.fields.keys())
                for field_name in existing - allowed:
                    self.fields.pop(field_name)
