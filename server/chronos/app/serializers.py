from django.core.exceptions import ValidationError
from rest_framework import serializers
import app

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = app.models.Events
        fields = ('id', 'title', 'description', 'creator', 'picture', "comment_id", "start_date", "end_date", "vote", "report", "is_deleted")

        def __init__(self, *args, **kwargs):
            fields = kwargs.pop('fields', None)
            
            super(serializers.ModelSerializer, self).__init__(*args, **kwargs)

            if fields:
                allowed = set(fields)
                existing = set(self.fields.keys())
                for field_name in existing - allowed:
                    self.fields.pop(field_name) 