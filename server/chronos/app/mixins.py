from django.shortcuts import render
from rest_framework.response import Response
from django.http import HttpResponse, HttpResponseServerError, Http404
from rest_framework import generics, status, viewsets, mixins
from app.serializers import *
from app.models import *

class RegularSecurityMixin(object):
    def get(self, request, *args, **kwargs):
        if request.user.is_anonymous():
            return Response("", status=status.HTTP_403_FORBIDDEN)
        elif request.user.userType == ChronosUser.REGULAR:
            return super(RegularSecurityMixin, self).get(request, args, kwargs)
        else:
            return Response("", status=status.HTTP_403_FORBIDDEN)

    def post(self, request):
        if request.user.is_anonymous():
            return Response("", status=status.HTTP_403_FORBIDDEN)
        elif request.user.userType == ChronosUser.REGULAR:
            return super(RegularSecurityMixin, self).post(request)
        else:
            return Response("", status=status.HTTP_403_FORBIDDEN)