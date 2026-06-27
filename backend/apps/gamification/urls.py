from django.urls import path

from .views import ForestView, SeenView, TimeCheckView

urlpatterns = [
    path("gamification/forest/", ForestView.as_view(), name="gamification-forest"),
    path("gamification/forest/seen/", SeenView.as_view(), name="gamification-seen"),
    path(
        "gamification/timecheck/",
        TimeCheckView.as_view(),
        name="gamification-timecheck",
    ),
]
