import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { Trash2, Plus, Minus } from "lucide-react";
import { axiosInstance } from "../../lib/axiosInstance";

type CartProduct = {
  cartProductId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
};

type UpdateCartQuantityRequest = {
  cartProductId: number;
  quantity: number;
};

function CartPage() {
  const [cart, setCart] = useState<CartProduct[]>([]);

  const navigate = useNavigate();

  const fetchCartProducts = useCallback(async () => {
    try {
      const response = await axiosInstance.get<CartProduct[]>("/carts");
      setCart(response.data);
    } catch (err) {
      console.error("カート商品の取得に失敗しました:", err);
    }
  }, []);

  useEffect(() => {
    fetchCartProducts();
  }, [fetchCartProducts]);

  /**
   * カート内の商品の数量を変更する
   *
   * @param index カート内の商品のインデックス
   * @param number 変更する数量(プラスの場合は1、マイナスの場合は-1)
   */
  const handleQuantityChange = async (index: number, number: number) => {
    const item = cart[index];
    const newQuantity = Math.max(1, item.quantity + number);

    // 楽観的更新（UIを先に更新）
    setCart((prev) =>
      prev.map((cartItem, i) =>
        i === index ? { ...cartItem, quantity: newQuantity } : cartItem,
      ),
    );

    try {
      const requestBody: UpdateCartQuantityRequest = {
        cartProductId: item.cartProductId,
        quantity: newQuantity,
      };

      await axiosInstance.patch("/carts/quantity", requestBody);
    } catch (err) {
      console.error("数量の更新に失敗しました:", err);
      // エラーが発生した場合は元の状態に戻す
      setCart((prev) =>
        prev.map((cartItem, i) =>
          i === index ? { ...cartItem, quantity: item.quantity } : cartItem,
        ),
      );
    }

    fetchCartProducts();
  };

  const handleDelete = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const getTotalPrice = () =>
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="max-w-2xl mx-auto px-2 py-8">
      <h1 className="text-xl font-bold mb-4 tracking-tight">カート</h1>

      <div className="space-y-3 mb-8">
        {cart.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            カートに商品がありません
          </div>
        ) : (
          cart.map((item, index) => (
            <Card
              key={item.cartProductId}
              className="border-none shadow-none bg-white/80"
            >
              <CardContent className="flex items-center gap-4 py-3 px-2">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-16 h-12 object-cover rounded-md border"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate text-base mb-1">
                    {item.name}
                  </div>

                  <div className="text-xs text-muted-foreground mb-1">{`¥${item.price}`}</div>

                  <div className="flex items-center gap-1 mt-1">
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      className="w-7 h-7 p-0 text-lg"
                      onClick={() => handleQuantityChange(index, -1)}
                      aria-label="マイナス"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>

                    <span className="w-8 text-center select-none text-sm font-medium">
                      {item.quantity}
                    </span>

                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      className="w-7 h-7 p-0 text-lg"
                      onClick={() => handleQuantityChange(index, 1)}
                      aria-label="プラス"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 min-w-[80px]">
                  <div className="font-bold text-base text-primary">
                    {`¥${(item.price * item.quantity).toLocaleString()}`}
                  </div>

                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="text-destructive px-2 py-0 h-7"
                    onClick={() => handleDelete(index)}
                    aria-label="削除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="flex justify-between items-center mt-8 border-t pt-4">
        <div className="text-base font-semibold">
          合計：
          <span className="text-primary font-bold text-lg">
            ¥{getTotalPrice().toLocaleString()}
          </span>
        </div>

        <Button
          type="button"
          disabled={cart.length === 0}
          className="px-6 h-10 rounded-lg shadow-sm"
          onClick={() => navigate({ to: "/order" })}
        >
          注文に進む
        </Button>
      </div>
    </div>
  );
}

export default CartPage;
