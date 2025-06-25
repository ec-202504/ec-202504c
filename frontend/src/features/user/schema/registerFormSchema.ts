import { z } from "zod";

export const registerFormSchema = z
  .object({
    name: z.string().trim().min(1, "名前は必須です"),
    email: z
      .string()
      .trim()
      .min(1, "メールアドレスは必須です")
      .email("メールアドレスの形式が正しくありません"),
    password: z
      .string()
      .trim()
      .min(8, "パスワードは8文字以上で入力してください")
      .max(16, "パスワードは16文字以下で入力してください")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/,
        "パスワードは英大文字・小文字・数字・記号をすべて含めてください",
      ),
    confirmPassword: z.string().min(1, "確認用パスワードは必須です"),
    zipcode: z
      .string()
      .trim()
      .min(1, "郵便番号は必須です")
      .regex(/^\d{3}-?\d{4}$/, "郵便番号の形式が不正です"),
    address: z.string().trim().min(1, "住所は必須です"),
    telephone: z
      .string()
      .trim()
      .min(1, "電話番号は必須です")
      .regex(/^0\d{1,4}-?\d{1,4}-?\d{3,4}$/, "電話番号の形式が不正です"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "パスワードが一致しません",
    path: ["confirmPassword"],
  });

export type RegisterForm = z.infer<typeof registerFormSchema>;
