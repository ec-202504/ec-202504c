import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { axiosInstance } from "../../lib/axiosInstance";
import { useNavigate } from "@tanstack/react-router";
import { formatToLocalDate } from "../../utils/formatToLocalDate";
import { orderSchema, type OrderFormData } from "./schema/orderSchema";

import { Button } from "../../components/ui/button";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Input } from "../../components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";

// TODO: ログインしているUserデータを取得する
const mockUser = {
  destinationName: "山田 太郎",
  destinationEmail: "taro@example.com",
  destinationZipcode: "123-4567",
  destinationPrefecture: "東京都",
  destinationMunicipalities: "千代田区",
  destinationAddress: "1-2-3",
  destinationTelephone: "03-1234-5678",
};

const mockCartProducts = [
  {
    name: "ゲーミングPC",
    quantity: 1,
    price: 150000,
    imageUrl: "https://placehold.jp/150x100.png?text=PC",
  },
  {
    name: "書籍『React入門』",
    quantity: 2,
    price: 3000,
    imageUrl: "https://placehold.jp/150x100.png?text=Book",
  },
];

type OrderRequest = {
  totalPrice: number;
  destinationName: string;
  destinationEmail: string;
  destinationZipcode: string;
  destinationPrefecture: string;
  destinationMunicipalities: string;
  destinationAddress: string;
  destinationTelephone: string;
  deliveryDateTime: string;
  paymentMethod: number;
  userId: number;
};

function OrderPage() {
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const orderForm = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      destinationName: mockUser.destinationName,
      destinationEmail: mockUser.destinationEmail,
      destinationZipcode: mockUser.destinationZipcode,
      destinationPrefecture: mockUser.destinationPrefecture,
      destinationMunicipalities: mockUser.destinationMunicipalities,
      destinationAddress: mockUser.destinationAddress,
      destinationTelephone: mockUser.destinationTelephone,
      paymentMethod: "0",
    },
  });

  const { setValue, getValues } = orderForm;

  // 合計金額を計算する関数
  const getTotalPrice = () =>
    mockCartProducts.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const onSubmit = async (data: OrderFormData) => {
    const orderRequest: OrderRequest = {
      totalPrice: getTotalPrice(),
      destinationName: data.destinationName,
      destinationEmail: data.destinationEmail,
      destinationZipcode: data.destinationZipcode.replace("-", ""),
      destinationPrefecture: data.destinationPrefecture,
      destinationMunicipalities: data.destinationMunicipalities,
      destinationAddress: data.destinationAddress,
      destinationTelephone: data.destinationTelephone,
      deliveryDateTime: formatToLocalDate(new Date()),
      paymentMethod: Number(data.paymentMethod),
      userId: 1, // TODO: ユーザーIDを取得する
    };

    try {
      await axiosInstance.post("/orders", orderRequest);
      navigate({ to: "/order/complete" });
    } catch (error) {
      console.error(error);
    }
  };

  const searchAddress = () => {
    // 外部APIで取得する想定。ここではダミー値をセット
    setValue("destinationPrefecture", "東京都");
    setValue("destinationMunicipalities", "千代田区");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">注文内容確認</h1>

      <div className="flex justify-end items-center gap-4 mb-8">
        <div className="text-lg font-semibold">
          小計：
          <span className="text-primary">
            ¥{getTotalPrice().toLocaleString()}
          </span>
        </div>

        <Button onClick={orderForm.handleSubmit(onSubmit)}>
          注文を確定する
        </Button>
      </div>

      <section className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">お届け先情報</h2>
          {!isEditing && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              変更
            </Button>
          )}
        </div>

        {isEditing ? (
          <Form {...orderForm}>
            <form
              className="p-5 space-y-4 text-sm bg-gray-50 rounded-lg"
              onSubmit={orderForm.handleSubmit(() => setIsEditing(false))}
            >
              <FormField
                control={orderForm.control}
                name="destinationName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>氏名：</FormLabel>

                    <FormControl>
                      <Input {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={orderForm.control}
                name="destinationEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>メール：</FormLabel>

                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={orderForm.control}
                name="destinationZipcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>郵便番号：</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input {...field} />
                      </FormControl>

                      <Button
                        type="button"
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={searchAddress}
                      >
                        住所検索
                      </Button>
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={orderForm.control}
                name="destinationPrefecture"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>都道府県：</FormLabel>

                    <FormControl>
                      <Input
                        {...field}
                        readOnly
                        tabIndex={-1}
                        className="bg-gray-100 cursor-not-allowed"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={orderForm.control}
                name="destinationMunicipalities"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>市区町村：</FormLabel>

                    <FormControl>
                      <Input
                        {...field}
                        readOnly
                        tabIndex={-1}
                        className="bg-gray-100 cursor-not-allowed"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={orderForm.control}
                name="destinationAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>番地等：</FormLabel>

                    <FormControl>
                      <Input placeholder="番地等" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={orderForm.control}
                name="destinationTelephone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>電話番号：</FormLabel>

                    <FormControl>
                      <Input {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2 mt-2">
                <Button type="submit">保存</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    orderForm.reset();
                  }}
                >
                  キャンセル
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <div className="grid gap-1 p-5 bg-gray-50 text-sm rounded-lg">
            <div>氏名：{getValues("destinationName")}</div>
            <div>メール：{getValues("destinationEmail")}</div>
            <div>郵便番号：{getValues("destinationZipcode")}</div>
            <div>
              住所：{getValues("destinationPrefecture")}
              {getValues("destinationMunicipalities")}
              {getValues("destinationAddress")}
            </div>
            <div>電話番号：{getValues("destinationTelephone")}</div>
          </div>
        )}
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2">決済方法</h2>
        <Form {...orderForm}>
          <FormField
            control={orderForm.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="0" id="cash" />
                      <label htmlFor="cash">現金</label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1" id="credit" />
                      <label htmlFor="credit">クレジットカード</label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Form>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">カート内容</h2>
        <ul className="space-y-4">
          {mockCartProducts.map((item) => (
            <li
              key={item.name}
              className="flex items-center gap-4 border-b pb-4 last:border-b-0"
            >
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-24 h-16 object-cover rounded border"
              />

              <div className="flex-1">
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-gray-500">
                  {`¥${item.price.toLocaleString()} × ${item.quantity}`}
                </div>
              </div>

              <div className="font-semibold">
                {`¥${(item.price * item.quantity).toLocaleString()}`}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default OrderPage;
