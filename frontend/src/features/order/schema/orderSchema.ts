import z from "zod";

export const orderSchema = z.object({
  destinationName: z.string().min(1, "氏名は必須です"),
  destinationEmail: z.string().email("有効なメールアドレスを入力してください"),
  destinationZipcode: z.string().min(1, "郵便番号は必須です"),
  destinationAddress: z.string().min(1, "住所は必須です"),
  destinationTelephone: z.string().min(1, "電話番号は必須です"),
  paymentMethod: z.string().min(1, "決済方法を選択してください"),
});

export type OrderForm = z.infer<typeof orderSchema>;
