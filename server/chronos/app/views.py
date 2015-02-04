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
from app.mixins import *
from rest_framework.views import APIView
from rest_framework.generics import GenericAPIView
from django.conf import settings
import datetime

##############################
# --------- Users! --------- #
##############################
class CreateUser(RegularSecurityMixin, generics.CreateAPIView):
    """
    Creates a new user in the system
    """
    permission_classes = (AllowAny,)
    serializer_class = app.serializers.ChronosUserRegisterSerializer

    def post(self, request):
        serializer = app.serializers.ChronosUserRegisterSerializer(data=request.DATA)
        if serializer.is_valid():
            if('username' not in request.DATA.keys() or 'password' not in request.DATA.keys() or 'email' not in request.DATA.keys() or 'first_name' not in request.DATA.keys() or 'last_name' not in request.DATA.keys()):
                return Response(status=status.HTTP_400_BAD_REQUEST)
            user = ChronosUser.objects.create_user(
                username=request.DATA["username"],
                password=request.DATA["password"],
                email=request.DATA["email"],
                first_name=request.DATA["first_name"],
                last_name=request.DATA["last_name"]
            )
            user.save()
            token, created = Token.objects.get_or_create(user=user)
            return Response(data={'token':token.key}, status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

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

class UpdateUser(RegularSecurityMixin, generics.CreateAPIView):
    """
    Updates the specified user in the system
    """
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = app.serializers.ChronosUserRegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = app.serializers.ChronosUserRegisterSerializer(fields=request.DATA.keys(), data=request.DATA)
        if self.request.user.id != request.DATA['id']:
           return Response({"error":"Cannot modify another user."}, status=status.HTTP_403_FORBIDDEN)

        if serializer.is_valid():
            user = ChronosUser.objects.get(pk=request.DATA['id'])
            if('password' in request.DATA.keys()):
                user.set_password(request.DATA['password'])
            if('email' in request.DATA.keys()):
                user.email = request.DATA['email']
            if('first_name' in request.DATA.keys()):
                user.first_name = request.DATA['first_name']
            if('last_name' in request.DATA.keys()):
                user.last_name = request.DATA['last_name']
            if('username' in request.DATA.keys()):
                user.username = request.DATA['username']
            #if('userType' in request.DATA.keys()):
            #    user.userType = request.DATA['userType']
            user.save()

            serializer = app.serializers.ChronosUserSerializer(user)
            return Response(data=serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class ListUsers(RegularSecurityMixin, generics.ListAPIView):
    """
    Lists all the users in the system
    """
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    serializer_class = ChronosUserSerializer

    def get_queryset(self):
        return ChronosUser.objects.all()

##############################
# --------- Events! -------- #
##############################
class EventOnlyView(generics.ListAPIView):
    serializer_class = app.serializers.EventSerializer

    def get(self, request, *args, **kwargs):
        print("what");

        if "eventID" not in kwargs.keys():
            return Response("Must provide an eventID in request", status.HTTP_400_BAD_REQUEST)
        eventID = int(kwargs["eventID"])
        try:
            event = Events.objects.get(pk=eventID)
            serializer = EventSerializer(event)
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
    serializer_class = app.serializers.EventSerializer

    def get_queryset(self):
        queryset = Events.objects.all()
        fromDate = self.request.QUERY_PARAMS.get('fromDate', None)
        toDate = self.request.QUERY_PARAMS.get('toDate', None)

        # if the from date is only specified, then we are looking for only that date
        if fromDate is not None:
            if toDate is not None:
                queryset = queryset.filter(start_date__range=[fromDate, toDate])
            else:
                queryset = queryset.filter(start_date=fromDate)
        return queryset

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

create_user = CreateUser.as_view()
delete_user = DeleteUser.as_view()
update_user = UpdateUser.as_view()
list_users = ListUsers.as_view()
list_specific_event = EventOnlyView.as_view()
list_create_event = EventView.as_view()