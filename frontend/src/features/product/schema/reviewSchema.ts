import { z } from "zod";

export const reviewFormSchema = z.object({
  comment: z
    .string()
    .min(1, "コメントを入力してください")
    .max(255, "コメントは255文字以内で入力してください"),
  rating: z
    .number()
    .min(1, "評価を選択してください")
    .max(5, "評価は1〜5の範囲で選択してください"),
});

export type ReviewFormData = z.infer<typeof reviewFormSchema>;
