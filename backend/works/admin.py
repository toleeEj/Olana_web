from django.contrib import admin
from .models import Portfolio, Product

@admin.register(Portfolio)
class PortfolioAdmin(admin.ModelAdmin):
    list_display = ('title', 'date', 'is_featured', 'created_at')
    list_filter = ('is_featured', 'date')
    search_fields = ('title', 'description', 'tags')
    prepopulated_fields = {}  # no slug yet

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('title', 'available', 'price', 'created_at')
    list_filter = ('available',)
    search_fields = ('title', 'description')