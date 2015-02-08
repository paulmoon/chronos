from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponseServerError
from django.shortcuts import get_object_or_404
from django.shortcuts import render
from rest_framework.response import Response
from django.http import HttpResponse, HttpResponseServerError, Http404
from app.serializers import *
from app.models import *
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authentication import TokenAuthentication
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly
from rest_framework import generics, status, viewsets, mixins
from rest_framework.views import APIView
from rest_framework.generics import GenericAPIView
from django.conf import settings
import datetime

##############################
# --------- Users! --------- #
##############################
class CreateUser(generics.CreateAPIView):
    """
    Creates a new user in the system
    """
    permission_classes = (AllowAny,)
    serializer_class = app.serializers.ChronosUserRegisterSerializer

    def post(self, request):
        serializer = app.serializers.ChronosUserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            token, created, user = serializer.save()
            return Response(data={'token':token.key}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DeleteUser(generics.CreateAPIView):
    """
    Deletes a user from the system. PLEASE REMOVE FOR PRODUCTION!!!
    """
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = app.serializers.ChronosUserRegisterSerializer

    def post(self, request):
        if('deletionID' in request.DATA.keys()):
            if not ChronosUser.objects.filter(id = request.DATA['deletionID']):
                return Response(status=status.HTTP_400_BAD_REQUEST)
            user = ChronosUser.objects.get(pk=request.DATA['deletionID'])
            user.delete()
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class UpdateUser(generics.CreateAPIView):
    """
    Updates the specified user in the system
    """
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = app.serializers.ChronosUserRegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = app.serializers.ChronosUserRegisterSerializer(data=request.data)
        if self.request.user.id != int(request.DATA['id']):
           return Response({"error":"Cannot modify another user."}, status=status.HTTP_403_FORBIDDEN)
        if serializer.is_valid():
            serializer.save()
            return Response(data=serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ListUsers(generics.ListAPIView):
    """
    Lists all the users in the system
    """
    permission_classes = (AllowAny,)
    serializer_class = ChronosUserSerializer

    def get_queryset(self):
        return ChronosUser.objects.all()

##############################
# --------- Events! -------- #
##############################
class EventOnlyView(generics.ListAPIView):
    permission_classes = (AllowAny,)
    serializer_class = app.serializers.EventReadSerializer

    def get(self, request, *args, **kwargs):
        if "eventID" not in kwargs.keys():
            return Response("Must provide an eventID in request", status.HTTP_400_BAD_REQUEST)
        eventID = int(kwargs["eventID"])
        try:
            event = Events.objects.get(pk=eventID)
            serializer = self.get_serializer_class()(event)
            return Response(serializer.data, status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return Response("Event with id {} does not exist.".format(
                eventID), status.HTTP_404_NOT_FOUND)

class EventView(generics.ListAPIView):
    """
    Gets a filtered set of events specified by a set of QUERY_PARAMS

    Example:
    /events/?fromDate=2006-01-01&toDate=2006-01-02
    """
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticatedOrReadOnly,)
    serializer_class = app.serializers.EventReadSerializer

    def get_queryset(self):
        queryset = Events.objects.all()
        commentid = self.request.query_params.get('commentID')
        placeid = self.request.query_params.get('placeID')
        creatorid = self.request.query_params.get('creatorID')
        fromDate = self.request.query_params.get('fromDate')
        toDate = self.request.query_params.get('toDate')
        tags = self.request.query_params.get('tags')
        filterargs = {}
        if commentid is not None:
            filterargs['comment_id'] = int(commentid)
        if placeid is not None:
            filterargs['place_id'] = placeid
        if creatorid is not None:
            filterargs['creator'] = int(creatorid)
        # If the from date is only specified, then we are looking for only that date
        if fromDate is not None:
            if toDate is not None:
                filterargs['start_date__range'] = [fromDate, toDate]
            else:
                filterargs['start_date'] = fromDate
        if tags:
            filterargs['tags__in'] = tags
        queryset = queryset.filter(**filterargs)
        return queryset

    def post(self, request, *args, **kwargs):
        serializer = app.serializers.EventWriteSerializer(data=request.data)
        if serializer.is_valid():
            event = serializer.save()
            return Response(data=serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TagView(generics.ListCreateAPIView):
    permission_classes = (AllowAny,)
    serializer_class = app.serializers.TagSerializer
    queryset = app.models.Tag.objects.all()

create_user = CreateUser.as_view()
delete_user = DeleteUser.as_view()
update_user = UpdateUser.as_view()
list_users = ListUsers.as_view()
list_specific_event = EventOnlyView.as_view()
list_create_event = EventView.as_view()
create_tag = TagView.as_view()
