import { Link } from "@tanstack/react-router";

export default function ProductNotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] w-full bg-gray-50 rounded-md shadow">
      <div className="text-lg text-gray-600 font-semibold mb-4">
        該当する商品が見つかりません
      </div>
      <Link
        to="/product"
        className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
      >
        商品一覧に戻る
      </Link>
    </div>
  );
}
