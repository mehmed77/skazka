// Oldindan tayyor avatarlar (backend AVATAR_CHOICES bilan mos kalitlar).
// Skeleton'da emoji; Faza 4'da illyustratsiya/Lottie bilan almashtiriladi.
export const AVATARS: { key: string; emoji: string; label: string }[] = [
  { key: "mishka", emoji: "🐻", label: "Mishka" },
  { key: "zayka", emoji: "🐰", label: "Zayka" },
  { key: "kotik", emoji: "🐱", label: "Kotik" },
  { key: "sobachka", emoji: "🐶", label: "Sobachka" },
  { key: "lisichka", emoji: "🦊", label: "Lisichka" },
  { key: "ptichka", emoji: "🐦", label: "Ptichka" },
];

export const avatarEmoji = (key: string) =>
  AVATARS.find((a) => a.key === key)?.emoji ?? "🐻";
