from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Portfolio, Product
from .serializers import PortfolioSerializer, ProductSerializer
from core.models import Profile  # Import for auto-assign

class PortfolioViewSet(viewsets.ModelViewSet):
    queryset = Portfolio.objects.all()
    serializer_class = PortfolioSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        # Auto-assign the logged-in user's profile (or main one if not authenticated)
        if self.request.user.is_authenticated:
            profile = self.request.user.profile
        else:
            profile = Profile.objects.first()  # Fallback for public, but not used for create
        serializer.save(profile=profile)

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        # Same auto-assign logic
        if self.request.user.is_authenticated:
            profile = self.request.user.profile
        else:
            profile = Profile.objects.first()
        serializer.save(profile=profile)