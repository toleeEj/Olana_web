from rest_framework import serializers
from .models import Profile, Skill, Education, Experience, Resume
from django.contrib.auth.models import User


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name', 'category', 'proficiency']

class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = ['id', 'institution', 'degree', 'start_year', 'end_year', 'description']

class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = ['id', 'organization', 'position', 'start_date', 'end_date', 'description', 'is_current']

class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = ['id', 'pdf_file', 'external_url', 'updated_at']

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




# ... your existing serializers (ProfileSerializer, SkillSerializer, etc.) ...

# from rest_framework import serializers
# from django.contrib.auth.models import User

# class RegisterSerializer(serializers.ModelSerializer):
#     password = serializers.CharField(write_only=True, min_length=8)

#     class Meta:
#         model = User
#         fields = ('username', 'email', 'password')

#     def create(self, validated_data):
#         user = User.objects.create_user(
#             username=validated_data['username'],
#             email=validated_data.get('email', ''),
#             password=validated_data['password']
#         )
#         return user
 
