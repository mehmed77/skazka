"""Umumiy DRF ruxsat klasslari.

Skeleton'da minimal; Faza 1'da RBAC (ota-ona / admin / institut) shu yerda
kengaytiriladi (TALIM `ModuleLicense` g'oyasi — SPEC §8, §10 billing).
"""

from rest_framework.permissions import SAFE_METHODS, BasePermission


class IsAdminOrReadOnly(BasePermission):
    """O'qish hammaga (autentifikatsiyalangan); yozish faqat staff'ga."""

    def has_permission(self, request, view) -> bool:
        if request.method in SAFE_METHODS:
            return bool(request.user and request.user.is_authenticated)
        return bool(request.user and request.user.is_staff)
