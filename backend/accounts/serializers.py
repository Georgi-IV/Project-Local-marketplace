from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Profile, ServiceRequest


class RegisterSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=150)
    dateOfBirth = serializers.DateField(required=False, allow_null=True, source="date_of_birth")
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    phone = serializers.CharField(required=False, allow_blank=True, max_length=30)
    location = serializers.CharField(required=False, allow_blank=True, max_length=255)

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already registered.")
        return value

    def create(self, validated_data):
        name = validated_data.get("name", "")
        date_of_birth = validated_data.get("date_of_birth")
        phone = validated_data.get("phone", "")
        email = validated_data["email"]
        password = validated_data["password"]
        location = validated_data.get("location", "")

        user = User(username=email, email=email)
        if name:
            user.first_name = name
        user.set_password(password)
        user.save()

        Profile.objects.create(
            user=user,
            date_of_birth=date_of_birth,
            phone=phone,
            location=location,
        )

        return user


class ServiceRequestSerializer(serializers.ModelSerializer):
    creator = serializers.SerializerMethodField()

    class Meta:
        model = ServiceRequest
        fields = [
            "id",
            "post_type",
            "title",
            "description",
            "location",
            "phone",
            "urgency",
            "icon",
            "creator_name",
            "creator",
        ]

    def get_creator(self, obj):
        if obj.creator_name:
            return obj.creator_name
        if obj.user:
            return obj.user.first_name or obj.user.email
        return "Anonymous"


class ProfileSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ["id", "name", "location", "phone", "date_of_birth"]

    def get_id(self, obj):
        return obj.user.id

    def get_name(self, obj):
        return obj.user.first_name or obj.user.email


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        from django.contrib.auth import authenticate

        email = attrs.get("email")
        password = attrs.get("password")

        if not email or not password:
            raise serializers.ValidationError("Email and password are required.")

        user = authenticate(username=email, password=password)
        if user is None:
            raise serializers.ValidationError("Invalid email or password.")

        attrs["user"] = user
        return attrs
