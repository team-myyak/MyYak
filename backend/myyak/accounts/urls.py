from django.urls import path, include
from . import views

urlpatterns = [
    path('', include('dj_rest_auth.urls')),
    path('', views.deleteUser, name='delete_user'),
    path('info/', views.userInfo, name='user_info'),
    path('signup/', include('dj_rest_auth.registration.urls')),
    path('signup/check-username/', views.isUniqueUsername, name='is_unique_username')
]

