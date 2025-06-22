import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { axiosInstance } from "../../lib/axiosInstance";
import { useNavigate } from "@tanstack/react-router";
import { orderSchema, type OrderForm } from "./schema/orderSchema";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "./components/PaymentForm";

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
import type { CartProduct } from "../../types/cartProduct";
import { toast } from "sonner";
import { fetchAddress } from "../../api/fetchAddress";

type OrderProduct = {
  cartProductId: number;
  productId: number;
  productCategory: number;
  quantity: number;
};

type OrderRequest = {
  totalPrice: number;
  destinationName: string;
  destinationEmail: string;
  destinationZipcode: string;
  destinationPrefecture: string;
  destinationMunicipalities: string;
  destinationAddress: string;
  destinationTelephone: string;
  paymentMethod: number;
  productList: OrderProduct[];
};

type UserResponse = {
  userId: number;
  name: string;
  email: string;
  zipcode: string;
  address: string;
  telephone: string;
};

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function OrderPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [clientSecret, setClientSecret] = useState<string>();
  const [cart, setCart] = useState<CartProduct[]>([]);
  const [prefecture, setPrefecture] = useState("");
  const [municipalities, setMunicipalities] = useState("");

  const navigate = useNavigate();

  const orderForm = useForm<OrderForm>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      destinationName: "",
      destinationEmail: "",
      destinationZipcode: "",
      destinationAddress: "",
      destinationTelephone: "",
      paymentMethod: "0",
    },
  });
  const { setValue, getValues, watch, reset, trigger } = orderForm;

  /**
   * カート内の商品の合計金額を計算する
   *
   * @returns 合計金額
   */
  const totalPrice = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart],
  );

  /**
   * ログインしているユーザー情報を取得する
   */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get<UserResponse>("/user");
        const user = response.data;

        // ユーザー情報をフォームにセット
        reset({
          destinationName: user.name,
          destinationEmail: user.email,
          destinationZipcode: user.zipcode,
          destinationAddress: user.address,
          destinationTelephone: user.telephone,
          paymentMethod: "0",
        });
        // isValidの状態を更新
        trigger();
      } catch (error) {
        toast.error("ユーザー情報の取得に失敗しました");
      }
    };
    fetchUser();
  }, [reset, trigger]);

  const onSubmit = async (data: OrderForm) => {
    const productList: OrderProduct[] = cart.map((item) => ({
      cartProductId: item.cartProductId,
      productId: item.productId,
      productCategory: item.productCategory,
      quantity: item.quantity,
    }));

    const orderRequest: OrderRequest = {
      totalPrice: totalPrice,
      destinationName: data.destinationName,
      destinationEmail: data.destinationEmail,
      destinationZipcode: data.destinationZipcode.replace("-", ""),
      destinationPrefecture: prefecture,
      destinationMunicipalities: municipalities,
      destinationAddress: data.destinationAddress,
      destinationTelephone: data.destinationTelephone,
      paymentMethod: Number(data.paymentMethod),
      productList: productList,
    };

    try {
      await axiosInstance.post("/orders", orderRequest);
      navigate({ to: "/order/complete" });
    } catch (error) {
      toast.error("注文に失敗しました");
    }
  };

  /**
   * 郵便番号から住所を検索する
   */
  const searchAddress = async () => {
    const zipcode = getValues("destinationZipcode");

    const address = await fetchAddress(zipcode);
    if (address) {
      setValue(
        "destinationAddress",
        `${address.prefecture}${address.municipalities}${address.rest}`,
      );
      setPrefecture(address.prefecture);
      setMunicipalities(address.municipalities);
    } else {
      toast.error("住所が見つかりませんでした");
    }
  };

  /**
   * Backend側の設定によって、クレジットカードの有効性を確認する
   */
  useEffect(() => {
    const fetchClientSecret = async () => {
      const response = await axiosInstance.post("/payments/verify-card");
      setClientSecret(response.data.clientSecret);
    };
    fetchClientSecret();
  }, []);

  // TODO: カートページにおいても一覧を取得しているため冗長。一元管理したい。
  const fetchCartProducts = useCallback(async () => {
    try {
      const response = await axiosInstance.get<CartProduct[]>("/carts");
      setCart(response.data);
    } catch (error) {
      toast.error("カート商品の取得に失敗しました");
    }
  }, []);

  useEffect(() => {
    fetchCartProducts();
  }, [fetchCartProducts]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">注文内容確認</h1>

      <div className="flex justify-end items-center gap-4 mb-8">
        <div className="text-lg font-semibold">
          小計：
          <span className="text-primary">¥{totalPrice.toLocaleString()}</span>
        </div>

        <Button
          onClick={orderForm.handleSubmit(onSubmit)}
          disabled={cart.length === 0 || !orderForm.formState.isValid}
        >
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
                        variant="default"
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
                name="destinationAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>住所：</FormLabel>

                    <FormControl>
                      <Input placeholder="住所" {...field} />
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
            <div>住所：{getValues("destinationAddress")}</div>
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

        {watch("paymentMethod") === "1" && clientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <PaymentForm />
          </Elements>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">カート内容</h2>
        <ul className="space-y-4">
          {cart.map((item) => (
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
