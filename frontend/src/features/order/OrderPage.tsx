import { useState } from "react";
import { Button } from "../../components/ui/button";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { axiosInstance } from "../../lib/axiosInstance";
import { useNavigate } from "@tanstack/react-router";
import { formatToLocalDate } from "../../utils/formatToLocalDate";

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
  const [paymentMethod, setPaymentMethod] = useState("0"); // "0":現金, "1":クレジットカード

  const [destination, setDestination] = useState({
    destinationName: mockUser.destinationName,
    destinationEmail: mockUser.destinationEmail,
    destinationZipcode: mockUser.destinationZipcode,
    destinationPrefecture: mockUser.destinationPrefecture,
    destinationMunicipalities: mockUser.destinationMunicipalities,
    destinationAddress: mockUser.destinationAddress,
    destinationTelephone: mockUser.destinationTelephone,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(destination);

  const navigate = useNavigate();

  // 合計金額を計算する関数
  const getTotalPrice = () =>
    mockCartProducts.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleOrder = async () => {
    const orderRequest: OrderRequest = {
      totalPrice: getTotalPrice(),
      destinationName: destination.destinationName,
      destinationEmail: destination.destinationEmail,
      destinationZipcode: destination.destinationZipcode.replace("-", ""),
      destinationPrefecture: destination.destinationPrefecture,
      destinationMunicipalities: destination.destinationMunicipalities,
      destinationAddress: destination.destinationAddress,
      destinationTelephone: destination.destinationTelephone,
      deliveryDateTime: formatToLocalDate(new Date()),
      paymentMethod: Number(paymentMethod),
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
    setEditForm({
      ...editForm,
      destinationPrefecture: "東京都",
      destinationMunicipalities: "千代田区",
    });
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

        <Button onClick={handleOrder}>注文を確定する</Button>
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
          <form
            className="p-5 space-y-4 text-sm bg-gray-50 rounded-lg"
            onSubmit={(e) => {
              e.preventDefault();
              setDestination(editForm);
              setIsEditing(false);
            }}
          >
            <div className="grid gap-3">
              <Label htmlFor="destinationName">氏名：</Label>
              <Input
                id="destinationName"
                value={editForm.destinationName}
                onChange={(e) =>
                  setEditForm({ ...editForm, destinationName: e.target.value })
                }
                required
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="destinationEmail">メール：</Label>
              <Input
                id="destinationEmail"
                type="email"
                value={editForm.destinationEmail}
                onChange={(e) =>
                  setEditForm({ ...editForm, destinationEmail: e.target.value })
                }
                required
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="destinationZipcode">郵便番号：</Label>
              <div className="flex gap-2">
                <Input
                  id="destinationZipcode"
                  value={editForm.destinationZipcode}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      destinationZipcode: e.target.value,
                    })
                  }
                  required
                />
                <Button
                  type="button"
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={searchAddress}
                >
                  住所検索
                </Button>
              </div>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="destinationPrefecture">都道府県：</Label>
              <Input
                id="destinationPrefecture"
                value={editForm.destinationPrefecture}
                readOnly
                tabIndex={-1}
                className="bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="destinationMunicipalities">市区町村：</Label>
              <Input
                id="destinationMunicipalities"
                value={editForm.destinationMunicipalities}
                readOnly
                tabIndex={-1}
                className="bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="destinationAddress">番地等：</Label>
              <Input
                id="destinationAddress"
                placeholder="番地等"
                value={editForm.destinationAddress}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    destinationAddress: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="destinationTelephone">電話番号：</Label>
              <Input
                id="destinationTelephone"
                value={editForm.destinationTelephone}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    destinationTelephone: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="flex gap-2 mt-2">
              <Button type="submit">保存</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setEditForm(destination);
                }}
              >
                キャンセル
              </Button>
            </div>
          </form>
        ) : (
          <div className="grid gap-1 p-5 bg-gray-50 text-sm rounded-lg">
            <div>氏名：{destination.destinationName}</div>
            <div>メール：{destination.destinationEmail}</div>
            <div>郵便番号：{destination.destinationZipcode}</div>
            <div>
              住所：{destination.destinationPrefecture}
              {destination.destinationMunicipalities}
              {destination.destinationAddress}
            </div>
            <div>電話番号：{destination.destinationTelephone}</div>
          </div>
        )}
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
