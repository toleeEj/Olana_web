from rest_framework import serializers
from .models import BlogCategory, BlogPost
from core.serializers import ProfileSerializer  # Import to show profile info if needed

# blog/serializers.py
class BlogCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogCategory
        fields = ['id', 'name', 'slug']
        

class BlogPostSerializer(serializers.ModelSerializer):
    category = BlogCategorySerializer(read_only=True)  # already there
    profile = ProfileSerializer(read_only=True)        # already there or add

    class Meta:
        model = BlogPost
        fields = [
            'id', 'profile', 'title', 'slug', 'content', 'featured_image',
            'category', 'tags', 'published_date', 'is_published',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['profile', 'slug', 'created_at', 'updated_at']