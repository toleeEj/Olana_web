from rest_framework import serializers
from .models import Portfolio, Product

class PortfolioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Portfolio
        fields = ['id', 'title', 'description', 'image', 'link', 'date', 'tags', 'is_featured', 'created_at']

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'title', 'description', 'price', 'image', 'available', 'link', 'created_at']