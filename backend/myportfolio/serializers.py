from rest_framework import serializers
from django.contrib.auth.models import User
from .models import *

class UserProfileSerializer(serializers.ModelSerializer):
    profile_photo = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = '__all__'

    def get_profile_photo(self, obj):
        if obj.profile_picture:
            request = self.context.get('request')
            url = obj.profile_picture.url
            if not request:
                return url

            absolute_url = request.build_absolute_uri(url)
            forwarded_proto = request.META.get('HTTP_X_FORWARDED_PROTO', '')
            if forwarded_proto == 'https' and absolute_url.startswith('http://'):
                absolute_url = absolute_url.replace('http://', 'https://', 1)
            return absolute_url
        return obj.profile_picture_url

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = '__all__'

class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = '__all__'

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = '__all__'

class TechnologySerializer(serializers.ModelSerializer):
    class Meta:
        model = Technology
        fields = '__all__'


class AdminCredentialUpdateSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(min_length=8, write_only=True)


class RegisteredUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']
