import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import ProductPage from "../../features/product/ProductPage";

export const Route = createFileRoute("/product/")({
  component: RouteComponent,
  // クエリパラメータのバリデーション
  validateSearch: (search: Record<string, unknown>) => {
    try {
      return z
        .object({
          tab: z.string().optional(),
        })
        .parse(search);
    } catch (error) {
      throw new Error("Invalid search parameters");
    }
  },
});

function RouteComponent() {
  return <ProductPage />;
}
