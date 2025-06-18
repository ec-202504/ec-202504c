import { createFileRoute } from "@tanstack/react-router";
import ProductPage from "../../features/product/ProductPage";

export const Route = createFileRoute("/product/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ProductPage />;
}
