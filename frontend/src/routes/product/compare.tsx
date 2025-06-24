import { createFileRoute } from "@tanstack/react-router";
import ComparePage from "../../features/compare/ComparePage";

export const Route = createFileRoute("/product/compare")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ComparePage />;
}
