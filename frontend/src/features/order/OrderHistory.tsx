import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

// ダミー注文履歴データ（画像付き）
const mockOrders = [
  {
    id: 2,
    orderDate: "2024-06-10",
    deliveryStatus: "配達済み",
    deliveryDate: "2024-06-12",
    totalPrice: 12000,
    products: [
      {
        name: "書籍『Next.js実践』",
        quantity: 1,
        subtotal: 3000,
        imageUrl:
          "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=facearea&w=96&q=80",
      },
      {
        name: "ゲーミングマウス",
        quantity: 2,
        subtotal: 9000,
        imageUrl:
          "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=facearea&w=96&q=80",
      },
    ],
  },
  {
    id: 1,
    orderDate: "2024-05-20",
    deliveryStatus: "配達中",
    deliveryDate: "2024-05-25",
    totalPrice: 156000,
    products: [
      {
        name: "ゲーミングPC",
        quantity: 1,
        subtotal: 150000,
        imageUrl:
          "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=96&q=80",
      },
      {
        name: "書籍『React入門』",
        quantity: 2,
        subtotal: 6000,
        imageUrl:
          "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=facearea&w=96&q=80",
      },
    ],
  },
];

function OrderHistory() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-2xl font-bold mb-6">注文履歴</h1>
      {mockOrders.map((order) => (
        <Card key={order.id} className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg">
                注文日: {order.orderDate}
              </CardTitle>
            </div>
            <Badge
              variant={
                order.deliveryStatus === "配達済み" ? "secondary" : "default"
              }
            >
              {order.deliveryStatus}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <span className="text-gray-600 mr-2">合計金額:</span>
              <span className="font-bold text-green-600 text-lg">
                ¥{order.totalPrice.toLocaleString()}
              </span>
            </div>
            <div className="divide-y">
              {order.products.map((item) => (
                <div key={item.name} className="flex items-center gap-4 py-4">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-28 h-28 object-cover rounded border"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                  </div>
                  <div className="text-right w-16">{item.quantity}個</div>
                  <div className="text-right w-24 font-bold text-green-700">
                    ¥{item.subtotal.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default OrderHistory;
