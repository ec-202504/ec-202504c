import { createFileRoute, redirect } from "@tanstack/react-router";
import OrderPage from "../../features/order/OrderPage";
import { userAtom } from "../../stores/compareAtom";
import { getDefaultStore } from "jotai";

export const Route = createFileRoute("/order/")({
  beforeLoad: async () => {
    // Fix: useAtomValueを使えないため、デフォルトストアから取得しているが、非推奨
    const store = getDefaultStore();
    const user = store.get(userAtom);
    // ログインしていない場合はログインページにリダイレクト
    if (!user) {
      throw redirect({ to: "/user/login" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <OrderPage />;
}
