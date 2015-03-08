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
from django.db.models import Q, Count

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

class UpdateUser(generics.UpdateAPIView):
    """
    Updates the specified user in the system
    """
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = app.serializers.ChronosUserUpdateSerializer

    def put(self, request, *args, **kwargs):
        user = app.models.ChronosUser.objects.get(pk=self.request.user.id)
        serializer = self.get_serializer_class()(user, data=request.data)
        if serializer.is_valid():
            serializer.save()

            # This has to be done because serializer.data is a strange django object, not a dictionary. There's no other way to remove the password field
            return_data = serializer.data
            return_data.pop('password')
            return Response(data=return_data, status=status.HTTP_200_OK)
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

class GetCurrentUserInformation(generics.RetrieveAPIView):
    """
    Get the current authenitcated user's information
    """
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated, )
    serializer_class = ChronosUserSerializer

    def get(self, request, *args, **kwargs):
        serializer = self.get_serializer_class()(request.user)
        return Response(serializer.data, status.HTTP_200_OK)

class GetUserInformation(generics.RetrieveAPIView):
    """
    Get a user's public information based on their id
    """
    permission_classes = (AllowAny,)
    serializer_class = ChronosPublicUserSerializer
    queryset = ChronosUser.objects.all()
    lookup_field = "username"

class GetSavedEvents(generics.ListAPIView):
    authentication_classes = (TokenAuthentication, )
    permission_classes = (IsAuthenticated, )
    serializer_class = app.serializers.EventReadSerializer

    def get_queryset(self):
        return self.request.user.saved_events.all();

##############################
# --------- Events! -------- #
##############################
class EventOnlyView(generics.RetrieveUpdateAPIView):
    permission_classes = (IsAuthenticatedOrReadOnly, )
    authentication_classes = (TokenAuthentication, )
    queryset = app.models.Events.objects.all()

    def get_serializer_class(self):
        if self.request.method == "GET":
            return app.serializers.EventReadSerializer
        else:
            return app.serializers.EventWriteSerializer

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
        placeid = self.request.query_params.get('placeID')
        creatorid = self.request.query_params.get('creatorID')
        fromDate = self.request.query_params.get('fromDate')
        toDate = self.request.query_params.get('toDate')
        tags = self.request.query_params.getlist('tag')
        keywords = self.request.query_params.getlist('keyword')

        filterargs = {}
        if placeid is not None:
            filterargs['place_id'] = placeid
        if creatorid is not None:
            filterargs['creator'] = int(creatorid)
        # If the from date is only specified, then we are looking for only that date
        if fromDate is not None:
            if toDate is not None:
                if ':' not in toDate:
                    filterargs['start_date__range'] = [fromDate, toDate[:10] + 'T23:59:59']
                else:
                    filterargs['start_date__range'] = [fromDate, toDate]
            else:
                filterargs['start_date__range'] = [fromDate, fromDate[:10] + 'T23:59:59']
        else:
            if toDate is not None:
                filterargs['start_date__range'] = [toDate + 'T00:00:00', toDate[:10] + 'T23:59:59']
        if len(tags) > 0:
            filterargs['tags__name__in'] = tags

        queryset = queryset.filter(**filterargs)

        if len(keywords) > 0:
            qset = Q()

            for word in keywords:
                qset |= Q(name__contains=word)
                qset |= Q(description__contains=word)

            queryset = queryset.filter(qset)

        queryset = queryset.annotate(itemcount=Count('id')).order_by('-itemcount', 'start_date', '-upvote')
        return queryset

    def post(self, request, *args, **kwargs):
        """
        Create new Event, backend should handle a lot if not all of the authentication/validation with frontend having
        another layer of security
        """
        request.data['creator'] = request.user.id
        serializer = app.serializers.EventWriteSerializer(data=request.data)
        if serializer.is_valid():
            event = serializer.save()
            return Response(data=serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VoteEvent(generics.GenericAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_clases = (IsAuthenticated,)
    serializer_class = app.serializers.VoteEventSerializer

    def post(self, request, *args, **kwargs):
        if not request.data.get("event_id"):
            return Response(data={"event_id": "This field is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            event = Events.objects.get(pk=int(request.data.get("event_id")))
        except Events.DoesNotExist:
            return Response(data={"event_id": "This event id does not exist"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            vote = app.models.Vote.objects.get(event=event, user=request.user)
            serializer = self.get_serializer_class()(vote, data=request.data)
        except app.models.Vote.DoesNotExist:
            serializer = self.get_serializer_class()(data=request.data)

        if serializer.is_valid():            
            vote = serializer.save(event=event, user=request.user)
            return Response (data=serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TagView(generics.ListCreateAPIView):
    permission_classes = (AllowAny,)
    serializer_class = app.serializers.TagSerializer
    queryset = app.models.Tag.objects.all()

class SaveEvent(generics.GenericAPIView):
    authentication_classes = (TokenAuthentication, )
    permission_classes = (IsAuthenticated, )
    lookup_url_kwarg = "event_id"
    serializer_class = app.serializers.SimpleEventSerializer

    def put(self, request, *args, **kwargs):
        if not kwargs.get(self.lookup_url_kwarg):
            return Response(data={"event_id": "This field is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            event = Events.objects.get(pk=int(kwargs.get(self.lookup_url_kwarg)))
        except Events.DoesNotExist:
            return Response(data={"event_id": "This event id does not exist"}, status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        user.saved_events.add(event)
        user.save()
        return Response(data=self.get_serializer_class()(event).data, status=status.HTTP_200_OK)

create_user = CreateUser.as_view()
delete_user = DeleteUser.as_view()
update_user = UpdateUser.as_view()
get_my_user = GetCurrentUserInformation.as_view()
get_user = GetUserInformation.as_view()
list_users = ListUsers.as_view()
list_specific_event = EventOnlyView.as_view()
list_create_event = EventView.as_view()
create_tag = TagView.as_view()
vote_event = VoteEvent.as_view()
save_event = SaveEvent.as_view()
get_saved_events = GetSavedEvents.as_view()