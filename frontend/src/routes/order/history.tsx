import { createFileRoute } from "@tanstack/react-router";
import OrderHistory from "../../features/order/OrderHistory";

export const Route = createFileRoute("/order/history")({
  component: RouteComponent,
});

function RouteComponent() {
  return <OrderHistory />;
}
