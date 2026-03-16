# blog/views.py

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import BlogCategory, BlogPost
from .serializers import BlogCategorySerializer, BlogPostSerializer
from core.models import Profile

class BlogCategoryViewSet(viewsets.ModelViewSet):          # ← changed from ReadOnlyModelViewSet
    queryset = BlogCategory.objects.all()
    serializer_class = BlogCategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    # Optional: if you want to auto-generate slug on create/update
    def perform_create(self, serializer):
        serializer.save()  # slug is handled in model save()

    def perform_update(self, serializer):
        serializer.save()


class BlogPostViewSet(viewsets.ModelViewSet):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        if self.request.user.is_authenticated and hasattr(self.request.user, 'profile'):
            profile = self.request.user.profile
        else:
            # Development fallback – remove or restrict in production
            profile = Profile.objects.first()
            if not profile:
                raise serializers.ValidationError(
                    "No profile exists in the database. Create one first via Django admin."
                )
        serializer.save(profile=profile)

    def perform_update(self, serializer):
        # Optional: you can add extra checks here later
        serializer.save()