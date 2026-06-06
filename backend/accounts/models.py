from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
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


class Review(models.Model):
    service = models.ForeignKey(
        ServiceRequest,
        on_delete=models.CASCADE,
        related_name="reviews",
    )
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="reviews",
    )
    author_name = models.CharField(max_length=150, blank=True)
    rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        default=5,
    )
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.author_name or 'Anonymous'} — {self.rating} stars"


class ProfileReview(models.Model):
    profile = models.ForeignKey(
        Profile,
        on_delete=models.CASCADE,
        related_name="profile_reviews",
    )
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="profile_reviews",
    )
    author_name = models.CharField(max_length=150, blank=True)
    rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        default=5,
    )
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.author_name or 'Anonymous'} — {self.rating} stars"
