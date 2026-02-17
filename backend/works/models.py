from django.db import models
from django.utils import timezone
from core.models import Profile  # We link some to profile if needed

class Portfolio(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.ImageField(upload_to='portfolios/', blank=True, null=True)
    link = models.URLField(blank=True, help_text="Optional external link (e.g., publication, presentation)")
    date = models.DateField(default=timezone.now)
    tags = models.CharField(max_length=300, blank=True, help_text="Comma-separated tags, e.g., research, case study, presentation")
    is_featured = models.BooleanField(default=False, help_text="Show in home page featured section?")
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-date', '-created_at']

class Product(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, help_text="Optional price if it's a paid service/program")
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    available = models.BooleanField(default=True)
    link = models.URLField(blank=True, help_text="Booking/registration link")
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']