from django.conf.urls import patterns, include, url

from django.contrib import admin
from rest_framework import routers
from app import views

admin.autodiscover()

router = routers.DefaultRouter()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'chronos.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    url(r'^', include(router.urls)),

    url(r'^events/?$', views.EventView.as_view()),
    url(r'^events/(?P<eventID>[0-9]+)/?$', views.EventView.as_view()),

    url(r'^admin/', include(admin.site.urls)),
)
