from django.conf.urls import patterns, include, url
from django.contrib import admin
from rest_framework import routers

admin.autodiscover()
router = routers.DefaultRouter()

urlpatterns = patterns('',
    url(r'^', include(router.urls)),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^docs/', include('rest_framework_swagger.urls')),

    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^users/verify_credentials/$', 'rest_framework.authtoken.views.obtain_auth_token'),
    url(r'^users/create/$', 'app.views.create_user'),
    url(r'^users/delete/$', 'app.views.delete_user'),
	url(r'^users/update/$', 'app.views.update_user'),
	url(r'^users/$', 'app.views.list_users'),

    url(r'^events/(?P<eventID>[0-9]+)/?$', 'app.views.list_specific_event'),
    url(r'^events/$', 'app.views.list_create_event'),
    url(r'events/vote/$', 'app.views.vote_event'),
    url(r'^tags/$', 'app.views.create_tag'),

)