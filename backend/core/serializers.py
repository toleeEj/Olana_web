from rest_framework import serializers
from .models import Profile, Skill, Education, Experience, Resume
from django.contrib.auth.models import User


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name', 'category', 'proficiency', 'profile']   # ← add profile here
        read_only_fields = ['profile']   # ← important: client cannot send it

class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = ['id', 'institution', 'degree', 'start_year', 'end_year', 'description', 'profile']
        read_only_fields = ['profile']   # ← prevent frontend from sending it

class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = ['id', 'organization', 'position', 'start_date', 'end_date', 'description', 'is_current', 'profile']
        read_only_fields = ['profile']

class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = ['id', 'profile', 'pdf_file', 'external_url', 'updated_at']
        read_only_fields = ['profile', 'updated_at']

class ProfileSerializer(serializers.ModelSerializer):
    skills = SkillSerializer(many=True, read_only=True)
    educations = EducationSerializer(many=True, read_only=True)
    experiences = ExperienceSerializer(many=True, read_only=True)
    resume = ResumeSerializer(read_only=True)

    class Meta:
        model = Profile
        fields = [
            'id', 'full_name', 'title', 'bio', 'profile_image', 'years_experience',
            'specialization', 'linkedin_url', 'created_at',
            'skills', 'educations', 'experiences', 'resume'
        ]





class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        user.is_staff = True          # ← This makes them an admin
        user.save()

        # Auto-create Profile (required by your other views)
        Profile.objects.create(
            user=user,
            full_name=validated_data['username']
        )
        return user


