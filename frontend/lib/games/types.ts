// O'yin dvigateli kontrakti — barcha mexanikalar (plugin) shu interfeysga amal qiladi.
import type { AgeBand } from "@/lib/types";

export type ResolvedItem = {
  id: string;
  type: string; // "word" | "letter"
  lemma?: string; // so'z uchun (harfda yo'q)
  translit?: string;
  stress_index?: number | null;
  l1_translation_json?: Record<string, string>;
  image_url: string | null;
  audio_url: string | null;
  confusable_ids: string[];
  // harf uchun
  char?: string;
  sound_ipa?: string;
};

// Faza 9 — ertak/qo'shiq kontent konteynerlari (item EMAS — spec'da keladi)
export type StoryNode = {
  order: number;
  text: string;
  audio_url: string | null;
  image_url: string | null;
  prompt_word: ResolvedItem | null; // comprehension gate (null = narration)
};
export type ResolvedStory = { id: string; title: string; nodes: StoryNode[] };
export type LyricLine = { text: string; word_id?: string };
export type ResolvedSong = {
  id: string;
  title: string;
  audio_url: string | null;
  lyrics_json: LyricLine[];
  words: ResolvedItem[];
};

export type GameSpec = {
  type: string;
  name_uz?: string;
  schema?: Record<string, unknown>;
  distractors?: { source?: string; exclude_confusable?: boolean };
  pair_mode?: string;
  story?: ResolvedStory | null; // sehrli_ertak
  song?: ResolvedSong | null; // qoshiq
};

export type AnswerResult = {
  itemId: string;
  itemType: string;
  gameType: string;
  correct: boolean;
  latencyMs: number;
  hintUsed: boolean;
};

export type MechanicProps = {
  items: ResolvedItem[]; // shu o'yin uchun sessiya so'zlari (new_items)
  pool: ResolvedItem[]; // distraktor manbai (mavzu/dars so'zlari)
  spec: GameSpec;
  ageBand: AgeBand;
  onResult: (r: Omit<AnswerResult, "gameType">) => void;
  onDone: () => void;
};

export type MechanicComponent = React.ComponentType<MechanicProps>;

export type ItemType = "word" | "letter";

// Item yorlig'i: harf uchun `char`, so'z uchun `lemma` — audio/aria/data-option uchun yagona manba.
export const itemLabel = (it: ResolvedItem): string =>
  it.type === "letter" ? it.char ?? "" : it.lemma ?? "";
