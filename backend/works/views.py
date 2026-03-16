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
        if self.request.user.is_authenticated and hasattr(self.request.user, 'profile'):
            profile = self.request.user.profile
        else:
            profile = Profile.objects.first()
            if not profile:
                raise serializers.ValidationError("No profile found. Create one first.")
        serializer.save(profile=profile)

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        if self.request.user.is_authenticated and hasattr(self.request.user, 'profile'):
            profile = self.request.user.profile
        else:
            profile = Profile.objects.first()
            if not profile:
                raise serializers.ValidationError("No profile found. Create one first.")
        serializer.save(profile=profile)