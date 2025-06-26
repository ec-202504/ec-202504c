import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { useNavigate } from "@tanstack/react-router";
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight } from "lucide-react";
import { axiosInstance } from "../../lib/axiosInstance";
import { useDebouncedCallback } from "use-debounce";
import { toast } from "sonner";
import type { CartProduct } from "../../types/cartProduct";
import { useAtomValue } from "jotai";
import { userAtom } from "../../stores/userAtom";
import { TAB_VALUES } from "../product/types/constants";

type UpdateCartQuantityRequest = {
  cartProductId: number;
  quantity: number;
};

function CartPage() {
  const [cart, setCart] = useState<CartProduct[]>([]);
  const user = useAtomValue(userAtom);

  const navigate = useNavigate();

  /**
   * カート内の商品の合計金額を計算する
   *
   * @returns 合計金額
   */
  const totalPrice = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart],
  );

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

  /**
   * カート内の商品の数量を変更する（デバウンス処理付き）
   *
   * @param cartProductId カート内の商品のID
   * @param quantity 変更する数量
   */
  const handleQuantityChange = useDebouncedCallback(
    async (cartProductId: number, quantity: number) => {
      if (quantity < 1) {
        return;
      }

      try {
        const requestBody: UpdateCartQuantityRequest = {
          cartProductId,
          quantity,
        };

        await axiosInstance.patch("/carts/quantity", requestBody);
      } catch (error) {
        toast.error("数量の更新に失敗しました");
      }

      fetchCartProducts();
    },
    200, // 200ms
  );

  const handleDelete = async (cartProductId: number) => {
    try {
      await axiosInstance.delete(`/carts/${cartProductId}`);
      toast.success("商品をカートから削除しました");
    } catch (e) {
      console.error("商品の削除に失敗しました:", e);
      toast.error("商品の削除に失敗しました");
    }

    fetchCartProducts();
  };

  const handleOrder = async () => {
    if (!user) {
      navigate({ to: "/user/login" });
    } else {
      navigate({ to: "/order" });
    }
  };

  return (
    <div className="min-h-screen py-14 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header Section */}
      <div className="text-center mb-8">
        <Badge variant="secondary" className="mb-4">
          <ShoppingCart className="w-4 h-4 mr-2" />
          ショッピングカート
        </Badge>

        <h1 className="text-3xl lg:text-4xl font-bold text-primary/80 dark:text-white mb-4">
          カート
        </h1>

        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          選択した商品の確認と注文手続きを行います
        </p>
      </div>

      {/* Cart Items Section */}
      <div className="max-w-4xl mx-auto">
        {cart.length === 0 ? (
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80">
            <CardContent className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                カートに商品がありません
              </h3>
              <p className="text-muted-foreground mb-6">
                商品を追加してからお戻りください
              </p>
              <Button
                onClick={() =>
                  navigate({ to: "/product", search: { tab: TAB_VALUES.PC } })
                }
                className="bg-primary hover:bg-primary/90"
              >
                商品を探す
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4 mb-8">
            {cart.map((item) => (
              <Card
                key={item.cartProductId}
                className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 dark:bg-slate-900/80"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-6 items-center">
                    <div className="flex-shrink-0">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-32 h-24 object-cover rounded-lg border shadow-sm"
                      />
                    </div>

                    <div className="flex-1 w-full flex flex-col gap-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-lg text-foreground truncate max-w-[70%]">
                          {item.name}
                        </h3>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="text-destructive hover:text-destructive/80 hover:bg-destructive/10 w-12 h-12"
                          onClick={() => handleDelete(item.cartProductId)}
                          aria-label="削除"
                        >
                          <Trash2 className="w-7 h-7" />
                        </Button>
                      </div>

                      <div className="text-sm text-muted-foreground">
                        単価：¥{item.price.toLocaleString()}
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            数量
                          </span>
                          <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            className="w-8 h-8"
                            onClick={() =>
                              handleQuantityChange(
                                item.cartProductId,
                                item.quantity - 1,
                              )
                            }
                            aria-label="マイナス"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-10 text-center font-medium text-lg">
                            {item.quantity}
                          </span>
                          <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            className="w-8 h-8"
                            onClick={() =>
                              handleQuantityChange(
                                item.cartProductId,
                                item.quantity + 1,
                              )
                            }
                            aria-label="プラス"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-muted-foreground mr-1">
                            小計
                          </span>
                          <span className="font-bold text-lg text-primary">
                            ¥{(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Order Summary Section */}
        {cart.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-border">
            <div className="text-center sm:text-left">
              <div className="text-muted-foreground text-sm mb-1">合計金額</div>
              <div className="text-3xl font-bold text-primary">
                ¥{totalPrice.toLocaleString()}
              </div>
            </div>

            <Button
              type="button"
              size="lg"
              className="bg-primary hover:bg-primary/90 px-8"
              onClick={handleOrder}
            >
              注文に進む
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartPage;
