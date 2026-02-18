from rest_framework import serializers
from .models import BlogCategory, BlogPost
from core.serializers import ProfileSerializer  # Import to show profile info if needed

class BlogCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogCategory
        fields = ['id', 'name', 'slug']

class BlogPostSerializer(serializers.ModelSerializer):
    category = BlogCategorySerializer(read_only=True)
    profile = ProfileSerializer(read_only=True)  # Optional: include profile details in API response

    class Meta:
        model = BlogPost
        fields = [
            'id', 'profile', 'title', 'slug', 'content', 'featured_image', 'category',
            'tags', 'published_date', 'is_published', 'created_at', 'updated_at'
        ]