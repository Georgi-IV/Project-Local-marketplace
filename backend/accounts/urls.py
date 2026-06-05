from django.urls import path

from . import views

urlpatterns = [
    path("register/", views.register, name="register"),
    path("login/", views.login, name="login"),
    path("services/", views.services, name="services"),
    path("services/<int:service_id>/reviews/", views.service_reviews, name="service_reviews"),
    path("profiles/", views.profiles, name="profiles"),
    path("my-profile/", views.my_profile, name="my_profile"),
]
