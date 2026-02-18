from rest_framework import serializers
from .models import Portfolio, Product
from core.serializers import ProfileSerializer  # Import to show profile if needed

class PortfolioSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)  # Optional: include profile details

    class Meta:
        model = Portfolio
        fields = ['id', 'profile', 'title', 'description', 'image', 'link', 'date', 'tags', 'is_featured', 'created_at']

class ProductSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)  # Optional: include profile details

    class Meta:
        model = Product
        fields = ['id', 'profile', 'title', 'description', 'price', 'image', 'available', 'link', 'created_at']