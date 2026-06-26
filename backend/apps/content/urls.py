from django.urls import path

from .views import CurriculumView, LessonView

urlpatterns = [
    path("curriculum/", CurriculumView.as_view(), name="curriculum"),
    path("lesson/<uuid:pk>/", LessonView.as_view(), name="lesson"),
]
