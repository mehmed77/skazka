# SKAZKA — qulay buyruqlar
# Windows'da `make` bo'lmasa: buyruqlarni qo'lda ko'chiring yoki Git Bash ishlating.

COMPOSE = docker compose

.PHONY: help up down build logs migrate makemigrations seed superuser shell test lint fmt

help:           ## Buyruqlar ro'yxati
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN{FS=":.*?## "}{printf "  \033[36m%-16s\033[0m %s\n", $$1, $$2}'

up:             ## Stack'ni ishga tushirish
	$(COMPOSE) up -d --build

down:           ## Stack'ni to'xtatish
	$(COMPOSE) down

logs:           ## Loglar (backend)
	$(COMPOSE) logs -f backend

migrate:        ## Migratsiyalarni qo'llash
	$(COMPOSE) exec backend python manage.py migrate

makemigrations: ## Migratsiya yaratish
	$(COMPOSE) exec backend python manage.py makemigrations

seed:           ## Demo kontent (placeholder — Faza 2'da to'ldiriladi)
	$(COMPOSE) exec backend python manage.py seed_demo

superuser:      ## Admin yaratish
	$(COMPOSE) exec backend python manage.py createsuperuser

shell:          ## Django shell
	$(COMPOSE) exec backend python manage.py shell

test:           ## Backend testlar
	$(COMPOSE) exec backend pytest

lint:           ## Lint (ruff + black check)
	$(COMPOSE) exec backend sh -c "ruff check . && black --check ."

fmt:            ## Formatlash (ruff --fix + black)
	$(COMPOSE) exec backend sh -c "ruff check --fix . && black ."
