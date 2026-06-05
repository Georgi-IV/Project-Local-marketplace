from django.conf import settings
from django.contrib.auth import login as auth_login
from django.core.mail import send_mail
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.authtoken.models import Token

from .serializers import (
    LoginSerializer,
    RegisterSerializer,
    ServiceRequestSerializer,
    ProfileSerializer,
    ReviewSerializer,
)
from .models import ServiceRequest, Profile, Review


def _build_user_payload(user):
    profile = getattr(user, "profile", None)
    token, _ = Token.objects.get_or_create(user=user)
    return {
        "name": user.first_name or "",
        "email": user.email,
        "dateOfBirth": profile.date_of_birth.isoformat() if profile and profile.date_of_birth else "",
        "phone": profile.phone if profile else "",
        "location": profile.location if profile else "",
        "token": token.key,
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
def service_reviews(request, service_id):
    if not request.user.is_authenticated:
        return Response(
            {"error": "Authentication required to post a review."},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    try:
        service = ServiceRequest.objects.get(id=service_id)
    except ServiceRequest.DoesNotExist:
        return Response(
            {"error": "Service not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    rating = request.data.get("rating")
    comment = request.data.get("comment", "").strip()

    if rating is None:
        return Response(
            {"rating": ["Rating is required."]},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        rating = int(rating)
    except (TypeError, ValueError):
        return Response(
            {"rating": ["Rating must be a number between 1 and 5."]},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if rating < 1 or rating > 5:
        return Response(
            {"rating": ["Rating must be between 1 and 5."]},
            status=status.HTTP_400_BAD_REQUEST,
        )

    author_name = request.user.first_name or request.user.email or "Anonymous"
    review = Review.objects.create(
        service=service,
        author=request.user,
        author_name=author_name,
        rating=rating,
        comment=comment,
    )
    serializer = ReviewSerializer(review)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


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
@api_view(["GET", "PUT"])
def my_profile(request):
    """
    Retrieve or update the current authenticated user's profile.
    
    GET: Returns Profile object with id, name, location, phone, and date_of_birth
    PUT: Updates profile fields and returns updated profile
    """
    if not request.user.is_authenticated:
        return Response(
            {"error": "User not authenticated"},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    try:
        profile = request.user.profile
    except Profile.DoesNotExist:
        return Response(
            {"error": "Profile not found for this user"},
            status=status.HTTP_404_NOT_FOUND
        )
    
    if request.method == "GET":
        serializer = ProfileSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    if request.method == "PUT":
        # Update user first_name from 'name' field
        if "name" in request.data:
            request.user.first_name = request.data["name"]
            request.user.save()
        
        # Update profile fields
        if "date_of_birth" in request.data or "dateOfBirth" in request.data:
            date_str = request.data.get("date_of_birth") or request.data.get("dateOfBirth")
            if date_str:
                profile.date_of_birth = date_str
        
        if "phone" in request.data:
            profile.phone = request.data["phone"]
        
        if "location" in request.data:
            profile.location = request.data["location"]
        
        profile.save()
        serializer = ProfileSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)
