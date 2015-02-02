from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponseServerError
from django.shortcuts import get_object_or_404
from django.shortcuts import render
from rest_framework import viewsets, generics, status
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from models import Events
from serializers import EventSerializer
import datetime
import app
# Create your views here.
class EventView(generics.ListCreateAPIView):
    serializer_class = app.serializers.EventSerializer
    def get(self, request, *args, **kwargs):
        eventID = int(kwargs["eventID"])
        try:
            event = Events.objects.get(pk=eventID)
            serializer = EventSerializer(event)
            return Response(serializer.data, status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return Response("Event with id {} does not exist.".format(
                eventID), status.HTTP_404_NOT_FOUND)


    def post(self, request, *args, **kwargs):
        serializer = app.serializers.EventSerializer(data=request.DATA)
        if(serializer.is_valid()):
            event = Events.objects.create(
                title=serializer.data["title"],
                description=serializer.data["description"],
                creator=serializer.data["creator"],
                create_date=datetime.date.today(),
                edit_date=datetime.date.today(),
                comment_id=serializer.data["comment_id"],
                picture=serializer.data["picture"],
                start_date=serializer.data["start_date"],
                end_date=serializer.data["end_date"],
                vote=serializer.data["vote"],
                report=serializer.data["report"],
                is_deleted=serializer.data["is_deleted"],
            )
            event.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)