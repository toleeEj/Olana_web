from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PortfolioViewSet, ProductViewSet

router = DefaultRouter()
router.register(r'portfolios', PortfolioViewSet, basename='portfolio')
router.register(r'products', ProductViewSet, basename='product')

urlpatterns = [
    path('', include(router.urls)),
]