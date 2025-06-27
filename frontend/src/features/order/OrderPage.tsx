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
import { Separator } from "../../components/ui/separator";
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
import {
  Loader2,
  CreditCard,
  MapPin,
  ShoppingCart,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { useAtomValue } from "jotai";
import { userAtom } from "../../stores/userAtom";
import { Card, CardContent } from "../../components/ui/card";
import { formatImageByte } from "../product/utils/formatImageByte";

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

type OrderCompleteResponse = {
  message: string;
  orderId: number;
};

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function OrderPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [clientSecret, setClientSecret] = useState<string>();
  const [cart, setCart] = useState<CartProduct[]>([]);
  const [prefecture, setPrefecture] = useState("");
  const [municipalities, setMunicipalities] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = useAtomValue(userAtom);

  const navigate = useNavigate();

  const orderForm = useForm<OrderForm>({
    resolver: zodResolver(orderSchema),
    mode: "onChange",
    defaultValues: {
      destinationName: "",
      destinationEmail: "",
      destinationZipcode: "",
      destinationAddress: "",
      destinationTelephone: "",
      paymentMethod: "0",
    },
  });
  const { setValue, getValues, watch, reset } = orderForm;

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
    // ユーザー情報をフォームにセット
    reset({
      destinationName: user?.name ?? "",
      destinationEmail: user?.email ?? "",
      destinationZipcode: user?.zipcode ?? "",
      destinationAddress: user?.address ?? "",
      destinationTelephone: user?.telephone ?? "",
      paymentMethod: "0",
    });
  }, [user, reset]);

  const onSubmit = async (data: OrderForm) => {
    setIsSubmitting(true);

    try {
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

      const response = await axiosInstance.post<OrderCompleteResponse>(
        "/orders",
        orderRequest,
      );
      navigate({
        to: "/order/$orderId/complete",
        params: { orderId: response.data.orderId.toString() },
      });
    } catch (error) {
      toast.error("注文に失敗しました");
    } finally {
      setIsSubmitting(false);
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
    <div className="min-h-screen py-14 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-primary/80 dark:text-white mb-4">
          注文内容確認
        </h1>

        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          注文内容とお届け先情報を確認して、注文を完了してください
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Delivery Information */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              お届け先情報
            </h2>
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
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80">
              <CardContent className="p-6">
                <Form {...orderForm}>
                  <form
                    className="space-y-4 text-sm"
                    onSubmit={orderForm.handleSubmit(() => setIsEditing(false))}
                  >
                    <FormField
                      control={orderForm.control}
                      name="destinationName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>名前：</FormLabel>
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
                          <FormLabel>メールアドレス：</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              {...field}
                              placeholder="techmate@example.com"
                            />
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
                              <Input {...field} placeholder="123-4567" />
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
                            <Input {...field} placeholder="090-1234-5678" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-2 mt-4">
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
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-2 text-sm">
              <div>名前：{getValues("destinationName")}</div>
              <div>メールアドレス：{getValues("destinationEmail")}</div>
              <div>郵便番号：{getValues("destinationZipcode")}</div>
              <div>住所：{getValues("destinationAddress")}</div>
              <div>電話番号：{getValues("destinationTelephone")}</div>
            </div>
          )}
        </div>

        <Separator />

        {/* Payment Method */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            決済方法
          </h2>
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
        </div>

        <Separator />

        {/* Cart Items */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" />
            カート内容
          </h2>

          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-4 border-b border-border/50 pb-4 last:border-b-0"
              >
                <img
                  src={formatImageByte(item.imageUrl)}
                  alt={item.name}
                  className="w-32 h-24 object-contain rounded-lg shadow-sm"
                />

                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {`¥${item.price.toLocaleString()} × ${item.quantity}`}
                  </div>
                </div>

                <div className="text-xl font-semibold text-primary">
                  {`¥${(item.price * item.quantity).toLocaleString()}`}
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Section - CartPageと同じデザイン */}
          {cart.length > 0 && (
            <>
              <Separator className="my-6" />
              <div className="flex flex-col sm:flex-row justify-between items-end gap-4">
                <div className="text-center sm:text-left">
                  <div className="text-muted-foreground text-sm mb-1">
                    合計金額
                  </div>
                  <div className="text-3xl font-bold text-primary">
                    ¥{totalPrice.toLocaleString()}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => navigate({ to: "/cart" })}
                    className="px-6"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    カートに戻る
                  </Button>

                  <Button
                    onClick={orderForm.handleSubmit(onSubmit)}
                    disabled={cart.length === 0 || isSubmitting}
                    size="lg"
                    className="bg-primary hover:bg-primary/90 px-8"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        注文処理中...
                      </>
                    ) : (
                      <>
                        注文を確定する
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderPage;
