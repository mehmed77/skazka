#!/usr/bin/env python
"""Django ma'muriy vazifalar uchun buyruq qatori yordamchisi."""

import os
import sys


def main() -> None:
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.dev")
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Django topilmadi. Virtual muhit faollashtirilganmi yoki "
            "talablar o'rnatilganmi?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()
