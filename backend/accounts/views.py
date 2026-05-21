from django.conf import settings
from django.core.mail import send_mail
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .serializers import LoginSerializer, RegisterSerializer, ServiceRequestSerializer
from .models import ServiceRequest


def _build_user_payload(user):
    profile = getattr(user, "profile", None)
    return {
        "name": user.first_name or "",
        "email": user.email,
        "dateOfBirth": profile.date_of_birth.isoformat() if profile and profile.date_of_birth else "",
        "phone": profile.phone if profile else "",
    }


@api_view(["POST"])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()

        subject = "Welcome to Local Marketplace"
        message = (
            f"Hello {user.first_name or user.email},\n\n"
            "Your account has been created successfully.\n"
            "Thank you for registering at Local Marketplace.\n\n"
            "If you did not create this account, please ignore this email.\n"
        )
        from_email = getattr(settings, "DEFAULT_FROM_EMAIL", "no-reply@example.com")

        send_mail(
            subject,
            message,
            from_email,
            [user.email],
            fail_silently=False,
        )

        return Response(
            {"user": _build_user_payload(user)},
            status=status.HTTP_201_CREATED,
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def services(request):
    services = ServiceRequest.objects.all()
    serializer = ServiceRequestSerializer(services, many=True)
    return Response(serializer.data)


@api_view(["POST"])
def login(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data["user"]
        return Response({"user": _build_user_payload(user)}, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
