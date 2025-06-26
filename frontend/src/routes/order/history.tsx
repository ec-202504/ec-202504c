import { createFileRoute } from "@tanstack/react-router";
import OrderHistory from "../../features/order/OrderHistory";
import { getDefaultStore } from "jotai";
import { userAtom } from "../../stores/userAtom";
import { redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/order/history")({
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
  return <OrderHistory />;
}
