from django.conf.urls import patterns, include, url
from django.contrib import admin
from rest_framework import routers

admin.autodiscover()
router = routers.DefaultRouter()

router = routers.DefaultRouter()

urlpatterns = patterns('',
    url(r'^', include(router.urls)),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^docs/', include('rest_framework_swagger.urls')),

    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^user/verify_credentials/$', 'rest_framework.authtoken.views.obtain_auth_token'),
    url(r'^user/create/$', 'app.views.create_user'),
    url(r'^user/delete/$', 'app.views.delete_user'),
	url(r'^user/update/$', 'app.views.update_user'),
	url(r'^users/$', 'app.views.list_users'),

    url(r'^events/?$', 'app.views.event_view'),
    url(r'^events/(?P<eventID>[0-9]+)/?$', 'app.views.event_view'),
)