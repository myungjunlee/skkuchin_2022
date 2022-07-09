from django.conf.urls import url
from django.urls import path, re_path, include
from django.views.generic import TemplateView
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
# from django.views.decorators.cache import cache_control

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    path('api/', include('info.urls')),
    path('api/', include('noti.urls')),
    # re_path(r'^favicon.ico', TemplateView.as_view(template_name='favicon.ico')),
    re_path(r'^robots.txt', TemplateView.as_view(template_name='robots.txt')),
    re_path(r'^sitemap.xml', TemplateView.as_view(template_name='sitemap.xml')),
    # url(r'^service-worker.js', cache_control(max_age=2592000)(TemplateView.as_view(template_name='service-worker.js', content_type='application/javascript',)), name='service-worker.js'),
    ]

# urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += [
	path("",TemplateView.as_view(template_name='index.html')),
	path('login',TemplateView.as_view(template_name='index.html')),
	path('search',TemplateView.as_view(template_name='index.html')),
	path('register',TemplateView.as_view(template_name='index.html')),
	path('guide',TemplateView.as_view(template_name='index.html')),
	re_path(r'^activate',TemplateView.as_view(template_name='index.html')),
	path('resend',TemplateView.as_view(template_name='index.html')),
	path('create',TemplateView.as_view(template_name='index.html')),
	re_path(r'^edit',TemplateView.as_view(template_name='index.html')),
	re_path(r'^detail',TemplateView.as_view(template_name='index.html')),
	path('mypage',TemplateView.as_view(template_name='index.html')),
	path('mypage_list',TemplateView.as_view(template_name='index.html')),
	path('account_edit',TemplateView.as_view(template_name='index.html')),
	path('alarm',TemplateView.as_view(template_name='index.html')),
	path('chat_list',TemplateView.as_view(template_name='index.html')),
	path('chat',TemplateView.as_view(template_name='index.html')),
	path('change_password',TemplateView.as_view(template_name='index.html')),
	path('user_delete',TemplateView.as_view(template_name='index.html')),
	path('reset',TemplateView.as_view(template_name='index.html')),
    path('reset_guide',TemplateView.as_view(template_name='index.html')),
    re_path(r'^password',TemplateView.as_view(template_name='index.html')),
	path('serviceagreement',TemplateView.as_view(template_name='index.html')),
    path('privacy',TemplateView.as_view(template_name='index.html')),
	path('download',TemplateView.as_view(template_name='index.html')),
	path('restaurant',TemplateView.as_view(template_name='index.html')),
	path('dashboard',TemplateView.as_view(template_name='index.html')),
    path(r'^noti',TemplateView.as_view(template_name='index.html')),
    path('noti_list',TemplateView.as_view(template_name='index.html')),
	]
# urlpatterns += [re_path(r'^.*',TemplateView.as_view(template_name='index.html'))]
