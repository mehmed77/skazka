"""Standart sahifalash — `?page_size` va `?page_size=all` qo'llab-quvvatlaydi."""

from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class DefaultPagination(PageNumberPagination):
    page_size = 200
    page_size_query_param = "page_size"
    max_page_size = 1000
    all_page_values = ("all", "0", "-1")

    def paginate_queryset(self, queryset, request, view=None):
        raw = request.query_params.get(self.page_size_query_param)
        if raw in self.all_page_values:
            self._full = list(queryset)
            return self._full
        return super().paginate_queryset(queryset, request, view)

    def get_paginated_response(self, data):
        if hasattr(self, "_full"):
            return Response(
                {
                    "count": len(self._full),
                    "next": None,
                    "previous": None,
                    "results": data,
                }
            )
        return super().get_paginated_response(data)
