from django.conf import settings
from django.conf.urls import patterns, include, url
from django.contrib import admin
from rest_framework import routers

admin.autodiscover()
router = routers.DefaultRouter()

urlpatterns = patterns('',
    url(r'^', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^users/verify_credentials/$', 'rest_framework.authtoken.views.obtain_auth_token'),
    url(r'^users/create/$', 'app.views.create_user'),
    url(r'^users/delete/$', 'app.views.delete_user'),
	url(r'^users/update/$', 'app.views.update_user'),
    url(r'^users/profile/$', 'app.views.get_my_user'),
    url(r'^users/profile/(?P<username>.+)/$', 'app.views.get_user'),
	url(r'^users/$', 'app.views.list_users'),
    url(r'^users/save/(?P<event_id>[0-9]+)/?$', 'app.views.save_event'),
    url(r'^users/unsave/(?P<event_id>[0-9]+)/?$', 'app.views.unsave_event'),
    url(r'^users/saved/$', 'app.views.get_saved_events'),

    url(r'^events/(?P<pk>[0-9]+)/?$', 'app.views.list_specific_event'),
    url(r'^events/$', 'app.views.list_event'),
    url(r'^events/create/$', 'app.views.create_event'),
    url(r'^events/vote/$', 'app.views.vote_event'),
    url(r'^events/report/$', 'app.views.report_event'),
    url(r'^tags/popular/$', 'app.views.get_popular_tags'),

    url(r'^images/$', 'app.views.upload_image'),

    url(r'^comments/(?P<event>[0-9]+)/?$', 'app.views.get_comments'),
    url(r'^comments/create/$', 'app.views.save_comment'),
)

if settings.DEBUG:
    urlpatterns += patterns('',
        url(r'^admin/', include(admin.site.urls)),
        url(r'^docs/', include('rest_framework_swagger.urls')),

        url(r'^media/(?P<path>.*)$', 'django.views.static.serve', {
            'document_root': settings.MEDIA_ROOT,
        }),
        url(r'^static/(?P<path>.*)$', 'django.views.static.serve', {
            'document_root': settings.STATIC_ROOT,
        }),
    )
