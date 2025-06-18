import { z } from "zod";

export const registerFormSchema = z
  .object({
    name: z.string().trim().min(1, "名前は必須です"),
    email: z
      .string()
      .trim()
      .min(1, "メールアドレは必須です")
      .email("@の形式で入力してください"),
    password: z.string().min(1, "パスワードは必須です"),
    confirmPassword: z.string().min(1, "確認用パスワードは必須です"),
    zipCode: z
      .string()
      .trim()
      .min(1, "郵便番号は必須です")
      .regex(/^\d{3}-?\d{4}$/, "郵便番号の形式が不正です"),
    address: z.string().trim().min(1, "住所は必須です"),
    telephone: z
      .string()
      .trim()
      .min(1, "電話番号は必須です")
      .regex(/^\d{10,11}$/, "電話番号の形式が不正です"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "パスワードが一致しません",
    path: ["confirmPassword"],
  });

export type RegisterForm = z.infer<typeof registerFormSchema>;
