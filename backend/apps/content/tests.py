"""content — model, seed va admin testlari (pytest --reuse-db)."""

import pytest
from django.core.management import call_command
from rest_framework_simplejwt.tokens import RefreshToken

from apps.accounts.models import ChildProfile, ParentAccount
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
    assert (
        Word.objects.count() == 15
    )  # 6 hayvon + 6 rang + 3 qisqa (so'z qurish, Faza 7)
    assert (
        Letter.objects.count() == 23
    )  # 1-guruh (8) + mavzu so'zlari harflari (Faza 7)
    assert (
        Lesson.objects.count() == 6
    )  # 2 mavzu + alifbo (2) + Hayvonlar ertak/qo'shiq (Faza 9)
    assert LessonStep.objects.count() == 14  # 4×3 (so'z/alifbo) + 2×1 (ertak/qo'shiq)


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


# ── Faza 3: kontent API (bola-kontekst, age_band, resolve, kesh) ─────


def _child_ctx(api, parent, child):
    """Bola-kontekst token (enter chiqargandek) bilan klientni sozlaydi."""
    access = RefreshToken.for_user(parent).access_token
    access["parent_id"] = str(parent.id)
    access["active_child_id"] = str(child.id)
    api.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")
    return api


@pytest.mark.django_db
def test_curriculum_requires_child_context(api, parent):
    access = RefreshToken.for_user(parent).access_token  # active_child_id YO'Q
    api.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")
    assert api.get("/api/v1/curriculum/").status_code == 403


@pytest.mark.django_db
def test_curriculum_foreign_child_forbidden(api, parent, parent_b):
    other = ChildProfile.objects.create(
        parent=parent_b, display_name="Begona", age_band="3-4"
    )
    access = RefreshToken.for_user(parent).access_token
    access["active_child_id"] = str(other.id)  # parent A token, parent B bolasi
    api.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")
    assert api.get("/api/v1/curriculum/").status_code == 403


@pytest.mark.django_db
def test_curriculum_age_band_filter(api, parent):
    call_command("seed_content")
    theme = Theme.objects.get(key="animals_home")
    Lesson.objects.create(
        theme=theme, order=9, title_uz="Katta dars", min_age_band="6-7"
    )

    def titles(resp):
        return [
            ls["title_uz"]
            for lvl in resp.data["levels"]
            for th in lvl["themes"]
            for ls in th["lessons"]
        ]

    child34 = ChildProfile.objects.create(
        parent=parent, display_name="A", age_band="3-4"
    )
    r34 = _child_ctx(api, parent, child34).get("/api/v1/curriculum/")
    assert r34.status_code == 200
    assert "Katta dars" not in titles(r34)  # 3-4 bola 6-7 darsni ko'rmaydi

    child67 = ChildProfile.objects.create(
        parent=parent, display_name="B", age_band="6-7"
    )
    r67 = _child_ctx(api, parent, child67).get("/api/v1/curriculum/")
    assert "Katta dars" in titles(r67)  # 6-7 bola ko'radi


@pytest.mark.django_db
def test_lesson_resolves_config(api, parent):
    call_command("seed_content")
    lesson = Lesson.objects.filter(theme__key="animals_home").first()
    child = ChildProfile.objects.create(parent=parent, display_name="A", age_band="6-7")
    r = _child_ctx(api, parent, child).get(f"/api/v1/lesson/{lesson.id}/")
    assert r.status_code == 200
    practice = next(s for s in r.data["steps"] if s["kind"] == "practice")
    item = practice["new_items"][0]
    assert item["type"] == "word" and "lemma" in item
    assert (
        "image_url" in item and "audio_url" in item
    )  # media null bo'lsa ham kalit bor
    assert "confusable_ids" in item
    eb = next(g for g in practice["games"] if g["type"] == "eshit_va_bos")
    assert eb["schema"]  # GameType.schema_json birga keldi
    assert r.has_header("ETag")


@pytest.mark.django_db
def test_lesson_resolves_story_and_song(api, parent):
    """Faza 9: ertak/qo'shiq darslari game.story/game.song'ni RESOLVE qiladi (konteyner, item emas)."""
    call_command("seed_content")
    child = ChildProfile.objects.create(parent=parent, display_name="A", age_band="6-7")
    c = _child_ctx(api, parent, child)

    story_lesson = Lesson.objects.get(theme__key="animals_home", order=2)
    r = c.get(f"/api/v1/lesson/{story_lesson.id}/")
    assert r.status_code == 200
    game = r.data["steps"][0]["games"][0]
    assert game["type"] == "sehrli_ertak"
    assert game["story"]["nodes"]  # sahnalar resolve qilingan
    gates = [n for n in game["story"]["nodes"] if n["prompt_word"]]
    assert (
        gates and gates[0]["prompt_word"]["lemma"]
    )  # comprehension gate so'zi resolve qilingan

    song_lesson = Lesson.objects.get(theme__key="animals_home", order=3)
    r2 = c.get(f"/api/v1/lesson/{song_lesson.id}/")
    sgame = r2.data["steps"][0]["games"][0]
    assert sgame["type"] == "qoshiq"
    assert sgame["song"]["words"] and sgame["song"]["lyrics_json"]


@pytest.mark.django_db
def test_lesson_age_band_forbidden(api, parent):
    call_command("seed_content")
    theme = Theme.objects.get(key="animals_home")
    hard = Lesson.objects.create(
        theme=theme, order=8, title_uz="Qiyin", min_age_band="6-7"
    )
    child = ChildProfile.objects.create(parent=parent, display_name="A", age_band="3-4")
    r = _child_ctx(api, parent, child).get(f"/api/v1/lesson/{hard.id}/")
    assert r.status_code == 403


@pytest.mark.django_db
def test_content_version_bumps_on_save():
    from apps.content.cache import content_version

    v1 = content_version()
    ru = Language.objects.get_or_create(code="ru", defaults={"name": "ru"})[0]
    Word.objects.create(language=ru, lemma="тест-кеш")
    assert content_version() > v1  # kesh invalidatsiya signali
