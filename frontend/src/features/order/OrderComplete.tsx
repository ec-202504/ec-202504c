import { Link } from "@tanstack/react-router";

// ダミーデータ
const orderDate = "2024-06-01";
const deliveryDate = "2024-06-05";
const totalPrice = 156000;
const products = [
  { name: "ゲーミングPC", quantity: 1, subtotal: 150000 },
  { name: "書籍『React入門』", quantity: 2, subtotal: 6000 },
];

function OrderComplete() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">注文完了確認</h1>
      <div className="border rounded p-5 mb-6 bg-white">
        <div className="mb-2 text-xl">
          注文ありがとうございました。注文完了メールを送信しました。
        </div>
        <div className="mb-2 text-base text-gray-700">
          <div className="flex justify-between">
            <span>注文日時：</span>
            <span className="text-right">{orderDate}</span>
          </div>
          <div className="flex justify-between">
            お届け予定日時：
            <span className="font-bold text-xl text-lime-600 text-right">
              {deliveryDate}
            </span>
          </div>
          <div className="flex justify-between">
            合計金額：
            <span className="font-bold text-xl text-right">
              ¥{totalPrice.toLocaleString()}
            </span>
          </div>
        </div>
        <div className="mb-2 font-semibold text-lg">商品内訳</div>
        <table className="w-full text-base mb-2 border">
          <thead>
            <tr className="bg-gray-100 text-lg">
              <th className="py-2 px-2 text-left">商品名</th>
              <th className="py-2 px-2 text-right">数量</th>
              <th className="py-2 px-2 text-right">小計</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item) => (
              <tr key={item.name}>
                <td className="py-2 px-2 border-t">{item.name}</td>
                <td className="py-2 px-2 border-t text-right">
                  {item.quantity}
                </td>
                <td className="py-2 px-2 border-t text-right">
                  ¥{item.subtotal.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-6">
          <Link
            to="/order/history"
            className="text-blue-600 hover:underline text-base"
          >
            注文履歴へ
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderComplete;
