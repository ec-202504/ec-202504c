import { createFileRoute, redirect } from "@tanstack/react-router";
import OrderComplete from "../../../features/order/OrderComplete";
import { axiosInstance } from "../../../lib/axiosInstance";
import type { OrderDetailResponse } from "../../../features/order/types/order";

export const Route = createFileRoute("/order/$orderId/complete")({
  loader: async ({ params }) => {
    try {
      const response = await axiosInstance.get<OrderDetailResponse>(
        `/orders/${params.orderId}`,
      );
      return response.data;
    } catch (error) {
      // 注文情報が見つからない場合は注文履歴ページにリダイレクト
      throw redirect({ to: "/order/history" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <OrderComplete />;
}
