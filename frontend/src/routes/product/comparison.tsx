import { createFileRoute } from "@tanstack/react-router";
import ComparisonPage from "../../features/comparison/ComparisonPage";

export const Route = createFileRoute("/product/comparison")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ComparisonPage />;
}
