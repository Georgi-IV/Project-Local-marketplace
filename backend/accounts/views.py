from django.conf import settings
from django.contrib.auth import login as auth_login
from django.core.mail import send_mail
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .serializers import LoginSerializer, RegisterSerializer, ServiceRequestSerializer, ProfileSerializer
from .models import ServiceRequest, Profile


def _build_user_payload(user):
    profile = getattr(user, "profile", None)
    return {
        "name": user.first_name or "",
        "email": user.email,
        "dateOfBirth": profile.date_of_birth.isoformat() if profile and profile.date_of_birth else "",
        "phone": profile.phone if profile else "",
        "location": profile.location if profile else "",
    }


@csrf_exempt
@api_view(["POST"])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        auth_login(request, user)

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


@csrf_exempt
@api_view(["GET", "POST"])
def services(request):
    if request.method == "POST":
        serializer = ServiceRequestSerializer(data=request.data)
        if serializer.is_valid():
            # determine post type (need or offer)
            post_type = request.data.get("post_type", "need")
            if request.user.is_authenticated:
                creator_name = request.user.first_name or request.user.email
            else:
                creator_name = "Anonymous"
            serializer.save(
                user=request.user if request.user.is_authenticated else None,
                creator_name=creator_name,
                post_type=post_type,
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # return only needs by default; allow filtering by post_type query param
    requested_type = request.GET.get("post_type")
    if requested_type:
        services = ServiceRequest.objects.filter(post_type=requested_type)
    else:
        services = ServiceRequest.objects.filter(post_type="need")

    requested_location = request.GET.get("location")
    if requested_location:
        services = services.filter(location__icontains=requested_location)
    elif request.user.is_authenticated:
        profile = getattr(request.user, "profile", None)
        if profile and profile.location:
            services = services.filter(location__icontains=profile.location)

    serializer = ServiceRequestSerializer(services, many=True)
    return Response(serializer.data)


@csrf_exempt
@api_view(["POST"])
def login(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data["user"]
        auth_login(request, user)
        return Response({"user": _build_user_payload(user)}, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(["GET"])
def profiles(request):
    """
    Retrieve all profiles with optional location filtering.
    
    Query Parameters:
    - location (optional): Filter profiles by location (case-insensitive substring match)
    
    Returns:
    List of profiles with id, name, location, phone, and date_of_birth
    """
    all_profiles = Profile.objects.all()
    
    requested_location = request.GET.get("location")
    if requested_location:
        all_profiles = all_profiles.filter(location__icontains=requested_location)
    
    serializer = ProfileSerializer(all_profiles, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@csrf_exempt
@api_view(["GET"])
def my_profile(request):
    """
    Retrieve the current authenticated user's profile.
    
    Returns:
    Profile object with id, name, location, phone, and date_of_birth
    """
    if not request.user.is_authenticated:
        return Response(
            {"error": "User not authenticated"},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    try:
        profile = request.user.profile
        serializer = ProfileSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Profile.DoesNotExist:
        return Response(
            {"error": "Profile not found for this user"},
            status=status.HTTP_404_NOT_FOUND
        )
