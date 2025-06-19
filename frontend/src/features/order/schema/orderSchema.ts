import z from "zod";

export const orderSchema = z.object({
  destinationName: z.string().min(1, "氏名は必須です"),
  destinationEmail: z.string().email("有効なメールアドレスを入力してください"),
  destinationZipcode: z.string().min(1, "郵便番号は必須です"),
  destinationPrefecture: z.string().min(1, "都道府県は必須です"),
  destinationMunicipalities: z.string().min(1, "市区町村は必須です"),
  destinationAddress: z.string().min(1, "番地等は必須です"),
  destinationTelephone: z.string().min(1, "電話番号は必須です"),
  paymentMethod: z.string().min(1, "決済方法を選択してください"),
});

export type OrderFormData = z.infer<typeof orderSchema>;
