from django.db import models
from django.utils import timezone

class Profile(models.Model):
    user = models.OneToOneField('auth.User', on_delete=models.CASCADE, related_name='profile', null=True, blank=True, default=None)  # Link to Django User
    full_name = models.CharField(max_length=100, default="Dr. Olana Wakoya Gichile")
    title = models.CharField(max_length=100, default="MD, MSc | Lecturer & General Practitioner")
    bio = models.TextField(default="A dedicated clinician-educator passionate about global health equity...")
    profile_image = models.ImageField(upload_to='profile/', blank=True, null=True)
    years_experience = models.PositiveIntegerField(default=10)
    specialization = models.CharField(max_length=200, default="Global Health, Internal Medicine, Medical Education")
    linkedin_url = models.URLField(blank=True, default="https://www.linkedin.com/in/olana-wakoya-gichile-a02483168")
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.full_name

    class Meta:
        verbose_name = "Profile"
        verbose_name_plural = "Profiles" 


class Skill(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='skills')
    name = models.CharField(max_length=100)
    category = models.CharField(
        max_length=50,
        choices=[
            ('clinical', 'Clinical Skills'),
            ('technical', 'Technical Skills'),
            ('soft', 'Soft Skills'),
            ('language', 'Languages'),
        ],
        default='clinical'
    )
    proficiency = models.CharField(max_length=50, blank=True)  # e.g., Expert, Advanced

    def __str__(self):
        return f"{self.name} ({self.category})"

    class Meta:
        ordering = ['category', 'name']



class Education(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='educations')
    institution = models.CharField(max_length=200)
    degree = models.CharField(max_length=100)
    start_year = models.PositiveIntegerField()
    end_year = models.PositiveIntegerField(blank=True, null=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.degree} - {self.institution}"

    class Meta:
        ordering = ['-end_year', '-start_year']

class Experience(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='experiences')
    organization = models.CharField(max_length=200)
    position = models.CharField(max_length=150)
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    description = models.TextField(blank=True)
    is_current = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.position} at {self.organization}"

    class Meta:
        ordering = ['-is_current', '-start_date']

# Simple Resume: we'll store PDF upload or link (one per profile for now)
class Resume(models.Model):
    profile = models.OneToOneField(Profile, on_delete=models.CASCADE, related_name='resume')
    pdf_file = models.FileField(upload_to='resumes/', blank=True, null=True)
    external_url = models.URLField(blank=True, help_text="Or link to external resume (e.g., Google Drive, LinkedIn)")
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Resume for {self.profile.full_name}"