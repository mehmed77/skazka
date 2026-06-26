#!/bin/sh
# SKAZKA — deploy "release" bosqichi.
# Ilova konteynerlari (backend/worker/beat) ko'tarilishidan OLDIN bir marta ishlaydi.
# CI deploy oqimida: `docker compose -f docker-compose.deploy.yml run --rm release`
#
# Qoidalar:
#   - migrate STROGO: muvaffaqiyatsiz bo'lsa deploy butunlay to'xtaydi.
#   - seed/setup buyruqlari TOLERANT: image'da yo'q bo'lsa sakrab o'tiladi,
#     lekin mavjud bo'lib XATO bersa — deploy to'xtaydi (xatoni yashirmaymiz).
set -eu

echo "[release] migratsiyalar boshlandi"
python manage.py migrate --noinput
echo "[release] migratsiyalar tugadi"

# Berilgan management buyrug'i shu image'da ro'yxatdan o'tganmi?
has_cmd() {
    python manage.py help "$1" >/dev/null 2>&1
}

# Idempotent seed/setup buyruqlari. Yangi app qo'shilsa shu ro'yxatga qo'shing.
for cmd in init_storage seed_demo; do
    if has_cmd "$cmd"; then
        echo "[release] $cmd ishga tushdi"
        python manage.py "$cmd"
    else
        echo "[release] $cmd shu image'da yo'q — sakrab o'tildi"
    fi
done

echo "[release] tayyor"
