from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Profile


class RegisterSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=150)
    dateOfBirth = serializers.DateField(required=False, allow_null=True, source="date_of_birth")
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    phone = serializers.CharField(required=False, allow_blank=True, max_length=30)

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

        user = User(username=email, email=email)
        if name:
            user.first_name = name
        user.set_password(password)
        user.save()

        Profile.objects.create(
            user=user,
            date_of_birth=date_of_birth,
            phone=phone,
        )

        return user


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
