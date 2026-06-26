"""content — model, seed va admin testlari (pytest --reuse-db)."""

import pytest
from django.core.management import call_command

from apps.accounts.models import ParentAccount
from apps.content.models import (
    GameType,
    Language,
    Lesson,
    LessonStep,
    Letter,
    Level,
    Theme,
    Word,
)
from apps.media.models import Media, MediaKind


@pytest.mark.django_db
def test_model_relations_and_nullable_media():
    ru = Language.objects.create(code="ru", name="Rus tili")
    level = Level.objects.create(language=ru, order=1, title_uz="1-daraja")
    theme = Theme.objects.create(level=level, order=1, key="t", title_uz="Mavzu")
    lesson = Lesson.objects.create(
        theme=theme, order=1, title_uz="Dars", min_age_band="3-4"
    )
    step = LessonStep.objects.create(lesson=lesson, order=1, kind="intro")
    # Media FK NULLABLE — media'siz so'z yaratish ishlaydi
    word = Word.objects.create(language=ru, lemma="кошка", theme=theme)
    assert word.image is None and word.audio_native is None
    assert step.lesson.theme.level.language.code == "ru"
    # Media biriktirish ham ishlaydi
    img = Media.objects.create(kind=MediaKind.IMAGE, title="cat")
    word.image = img
    word.save()
    assert Word.objects.get(pk=word.pk).image_id == img.id


@pytest.mark.django_db
def test_seed_content_idempotent():
    call_command("seed_content")
    snap1 = (
        Word.objects.count(),
        GameType.objects.count(),
        Letter.objects.count(),
        Lesson.objects.count(),
        LessonStep.objects.count(),
    )
    call_command("seed_content")  # qayta ishga tushirish — dublikat bo'lmasin
    snap2 = (
        Word.objects.count(),
        GameType.objects.count(),
        Letter.objects.count(),
        Lesson.objects.count(),
        LessonStep.objects.count(),
    )
    assert snap1 == snap2, (snap1, snap2)
    assert GameType.objects.count() == 11
    assert Word.objects.count() == 12  # 6 hayvon + 6 rang
    assert Letter.objects.count() == 8
    assert Lesson.objects.count() == 2
    assert LessonStep.objects.count() == 6


@pytest.mark.django_db
def test_word_stress_and_l1_json():
    call_command("seed_content")
    w = Word.objects.get(lemma="кошка")
    assert w.stress_index == 1
    assert w.l1_translation_json["uz"] == "mushuk"
    assert w.gender == "f"


@pytest.mark.django_db
def test_gametype_schema_present():
    call_command("seed_content")
    gt = GameType.objects.get(key="eshit_va_bos")
    assert gt.min_age_band == "3-4"
    assert gt.schema_json  # bo'sh emas


@pytest.mark.django_db
def test_confusable_symmetric():
    # §4.4 — confusable bog'lanish simmetrik (A↔B)
    call_command("seed_content")
    koshka = Word.objects.get(lemma="кошка")
    koza = Word.objects.get(lemma="коза")
    assert koza in koshka.confusable_with.all()
    assert koshka in koza.confusable_with.all()


@pytest.mark.django_db
def test_config_json_new_shape():
    call_command("seed_content")
    lesson = Lesson.objects.filter(theme__key="animals_home").first()
    practice = LessonStep.objects.get(lesson=lesson, kind="practice")
    cfg = practice.config_json
    # new_items — tipli obyektlar
    assert "new_items" in cfg and "games" in cfg
    assert all("type" in it and "id" in it for it in cfg["new_items"])
    assert cfg["new_items"][0]["type"] == "word"
    # games — obyektlar ro'yxati; eshit_va_bos distractor parametrlari bilan (§4.4)
    eb = next(g for g in cfg["games"] if g["type"] == "eshit_va_bos")
    assert eb["distractors"]["source"] == "theme"
    assert eb["distractors"]["exclude_confusable"] is True


@pytest.mark.django_db
def test_admin_pages_load(client):
    admin = ParentAccount.objects.create_superuser(
        phone="+998900000099", password="Adm1nPass9"
    )
    client.force_login(admin)
    for url in [
        "/admin/content/word/",
        "/admin/content/lesson/",
        "/admin/content/theme/",
        "/admin/content/gametype/",
        "/admin/media/media/",
    ]:
        assert client.get(url).status_code == 200, url
