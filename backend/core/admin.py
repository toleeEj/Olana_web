from django.contrib import admin
from .models import Profile
from .models import Skill
from .models import Education
from .models import Experience
from .models import Resume

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'title', 'years_experience', 'specialization')
    readonly_fields = ('created_at',)

    fieldsets = (
        (None, {
            'fields': ('full_name', 'title', 'bio', 'profile_image')
        }),
        ('Details', {
            'fields': ('years_experience', 'specialization', 'linkedin_url')
        }),
    )


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'profile')
    list_filter = ('category',)



@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = ('degree', 'institution', 'start_year', 'end_year', 'profile')
    list_filter = ('profile',)

@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ('position', 'organization', 'start_date', 'end_date', 'is_current', 'profile')
    list_filter = ('is_current', 'profile')

@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ('profile', 'updated_at')