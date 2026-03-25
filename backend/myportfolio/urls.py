from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'profile', UserProfileViewSet)
router.register(r'projects', ProjectViewSet)
router.register(r'skills', SkillViewSet)
router.register(r'experience', ExperienceViewSet)
router.register(r'messages', ContactMessageViewSet)
router.register(r'technologies', TechnologyViewSet)
router.register(r'users', RegisteredUserViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/credentials/', AdminCredentialUpdateView.as_view(), name='admin-credentials-update'),
]