import { createFileRoute } from "@tanstack/react-router";
import CartPage from "../../features/cart/CartPage";

export const Route = createFileRoute("/cart/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <CartPage />;
}
