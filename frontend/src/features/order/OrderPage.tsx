import { useState } from "react";
import { Button } from "../../components/ui/button";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Label } from "../../components/ui/label";
import { axiosInstance } from "../../lib/axiosInstance";
import { useNavigate } from "@tanstack/react-router";
import { formatToLocalDate } from "../../utils/formatToLocalDate";

// 仮データ（本来はAPIやContextから取得）
const mockOrder = {
  subtotal: 156000,
  destination: {
    name: "山田 太郎",
    email: "taro@example.com",
    zipcode: "123-4567",
    prefecture: "東京都",
    municipalities: "千代田区",
    address: "1-2-3",
    telephone: "03-1234-5678",
  },
  products: [
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
  ],
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
  deliveryDateTime: string;
  paymentMethod: number;
  userId: number;
};

function OrderPage() {
  const { subtotal, destination, products } = mockOrder;
  const [paymentMethod, setPaymentMethod] = useState("0"); // "0":現金, "1":クレジットカード

  const navigate = useNavigate();

  const handleOrder = async () => {
    const orderRequest: OrderRequest = {
      totalPrice: subtotal,
      destinationName: destination.name,
      destinationEmail: destination.email,
      destinationZipcode: destination.zipcode.replace("-", ""),
      destinationPrefecture: destination.prefecture,
      destinationMunicipalities: destination.municipalities,
      destinationAddress: destination.address,
      destinationTelephone: destination.telephone,
      deliveryDateTime: formatToLocalDate(new Date()),
      paymentMethod: Number(paymentMethod),
      userId: 1, // TODO: ユーザーIDを取得する
    };

    console.log(orderRequest);

    try {
      await axiosInstance.post("/orders", orderRequest);
      navigate({ to: "/order/complete" });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">注文内容確認</h1>

      <div className="flex justify-end items-center gap-4 mb-8">
        <div className="text-lg font-semibold">
          小計：
          <span className="text-primary">¥{subtotal.toLocaleString()}</span>
        </div>

        <Button onClick={handleOrder}>注文を確定する</Button>
      </div>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2">お届け先情報</h2>
        <div className="bg-gray-50 rounded p-4 text-sm">
          <div>氏名：{destination.name}</div>
          <div>メール：{destination.email}</div>
          <div>郵便番号：{destination.zipcode}</div>
          <div>
            住所：{destination.prefecture}
            {destination.municipalities}
            {destination.address}
          </div>
          <div>電話番号：{destination.telephone}</div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2">決済方法</h2>
        <RadioGroup
          value={paymentMethod}
          onValueChange={setPaymentMethod}
          className="flex gap-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="0" id="cash" />
            <Label htmlFor="cash">現金</Label>
          </div>

          <div className="flex items-center space-x-2">
            <RadioGroupItem value="1" id="credit" />
            <Label htmlFor="credit">クレジットカード</Label>
          </div>
        </RadioGroup>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">カート内容</h2>
        <ul className="space-y-4">
          {products.map((item) => (
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
