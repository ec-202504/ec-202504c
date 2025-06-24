import { createFileRoute } from "@tanstack/react-router";
import ComparePage from "../../features/product/ComparePage";

export const Route = createFileRoute("/product/compare")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ComparePage />;
}
