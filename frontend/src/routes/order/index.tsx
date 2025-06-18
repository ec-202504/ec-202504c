import { createFileRoute } from "@tanstack/react-router";
import OrderPage from "../../features/order/OrderPage";

export const Route = createFileRoute("/order/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <OrderPage />;
}
