from django.contrib import admin

from .models import Profile, ServiceRequest, Review


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "date_of_birth", "phone")
    search_fields = ("user__email", "user__username", "phone")


@admin.register(ServiceRequest)
class ServiceRequestAdmin(admin.ModelAdmin):
    list_display = ("title", "location", "urgency", "user", "created_at")
    list_filter = ("urgency", "location")
    search_fields = ("title", "description", "location", "user__email")


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("service", "author_name", "rating", "created_at")
    list_filter = ("rating",)
    search_fields = ("author_name", "comment", "service__title")
