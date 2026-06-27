from django.urls import path

from .views import EventView, SessionView

urlpatterns = [
    path("learning/event/", EventView.as_view(), name="learning-event"),
    path("learning/session/", SessionView.as_view(), name="learning-session"),
]
