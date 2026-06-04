from django.conf import settings
from django.db import models


class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="profile")
    date_of_birth = models.DateField(null=True, blank=True)
    phone = models.CharField(max_length=30, blank=True)
    location = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return self.user.email or self.user.username


class ServiceRequest(models.Model):
    URGENCY_CHOICES = [
        ("urgent", "Urgent"),
        ("soon", "Soon"),
        ("whenever", "Whenever"),
        ("normal", "Normal"),
    ]
    POST_TYPE_CHOICES = [
        ("need", "Need"),
        ("offer", "Offer"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="service_requests",
    )
    creator_name = models.CharField(max_length=150, blank=True)
    post_type = models.CharField(max_length=10, choices=POST_TYPE_CHOICES, default="need")
    title = models.CharField(max_length=255)
    description = models.TextField()
    location = models.CharField(max_length=255)
    phone = models.CharField(max_length=30, blank=True)
    urgency = models.CharField(max_length=10, choices=URGENCY_CHOICES, default="normal")
    icon = models.CharField(max_length=5, default="🛠️")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title
