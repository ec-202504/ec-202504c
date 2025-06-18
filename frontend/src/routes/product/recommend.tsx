import { createFileRoute } from "@tanstack/react-router";
import ProductRecommendPage from "../../features/product/ProductRecommendPage";

export const Route = createFileRoute("/product/recommend")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ProductRecommendPage />;
}
