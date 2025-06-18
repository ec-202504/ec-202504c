import { createFileRoute } from "@tanstack/react-router";
import OrderComplete from "../../features/order/OrderComplete";

export const Route = createFileRoute("/order/complete")({
  component: RouteComponent,
});

function RouteComponent() {
  return <OrderComplete />;
}
