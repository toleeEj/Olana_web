from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny
from .models import Profile, Skill, Education, Experience, Resume
from .serializers import (
    ProfileSerializer, SkillSerializer, EducationSerializer,
    ExperienceSerializer, ResumeSerializer
)

from rest_framework import generics
from django.contrib.auth.models import User
from .serializers import UserRegisterSerializer

class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        if self.request.user.is_authenticated and hasattr(self.request.user, 'profile'):
            profile = self.request.user.profile
        else:
            # Fallback: use first profile (useful for testing)
            # In production → raise error or use admin-only
            profile = Profile.objects.first()
            if not profile:
                raise serializers.ValidationError("No profile exists in the database. Create one first.")

        serializer.save(profile=profile)

    def perform_update(self, serializer):
        # Optional: only allow owner or staff
        serializer.save()

class EducationViewSet(viewsets.ModelViewSet):
    queryset = Education.objects.all()
    serializer_class = EducationSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        if self.request.user.is_authenticated and hasattr(self.request.user, 'profile'):
            profile = self.request.user.profile
        else:
            # Fallback for development / testing
            profile = Profile.objects.first()
            if not profile:
                raise serializers.ValidationError(
                    "No profile exists in the database. Please create one first (via Django admin)."
                )

        serializer.save(profile=profile)

class ExperienceViewSet(viewsets.ModelViewSet):
    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        if self.request.user.is_authenticated and hasattr(self.request.user, 'profile'):
            profile = self.request.user.profile
        else:
            profile = Profile.objects.first()
            if not profile:
                raise serializers.ValidationError("No profile exists. Create one first.")
        serializer.save(profile=profile)

class ResumeViewSet(viewsets.ModelViewSet):
    queryset = Resume.objects.all()
    serializer_class = ResumeSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        if self.request.user.is_authenticated and hasattr(self.request.user, 'profile'):
            profile = self.request.user.profile
        else:
            profile = Profile.objects.first()
            if not profile:
                raise serializers.ValidationError("No profile found. Create one first.")
        serializer.save(profile=profile)

    def perform_update(self, serializer):
        # Same logic if needed
        serializer.save()


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer
    permission_classes = [AllowAny]