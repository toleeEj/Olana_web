from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly
from .models import BlogCategory, BlogPost
from .serializers import BlogCategorySerializer, BlogPostSerializer
from core.models import Profile  # Import for auto-assign

class BlogCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BlogCategory.objects.all()
    serializer_class = BlogCategorySerializer
    permission_classes = [AllowAny]

class BlogPostViewSet(viewsets.ModelViewSet):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        # Auto-assign the logged-in user's profile (or main one if no user)
        profile = self.request.user.profile if self.request.user.is_authenticated else Profile.objects.first()
        serializer.save(profile=profile)