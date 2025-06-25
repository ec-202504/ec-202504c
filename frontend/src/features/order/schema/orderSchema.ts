import z from "zod";

export const orderSchema = z.object({
  destinationName: z.string().trim().min(1, "名前は必須です"),
  destinationEmail: z
    .string()
    .trim()
    .min(1, "メールアドレスは必須です")
    .email("メールアドレスの形式が正しくありません"),
  destinationZipcode: z
    .string()
    .trim()
    .min(1, "郵便番号は必須です")
    .regex(/^\d{3}-?\d{4}$/, "郵便番号の形式が不正です"),
  destinationAddress: z.string().trim().min(1, "住所は必須です"),
  destinationTelephone: z
    .string()
    .trim()
    .min(1, "電話番号は必須です")
    .regex(/^0\d{1,4}-?\d{1,4}-?\d{3,4}$/, "電話番号の形式が不正です"),
  paymentMethod: z.string().trim().min(1, "決済方法を選択してください"),
});

export type OrderForm = z.infer<typeof orderSchema>;
