import { createFileRoute } from "@tanstack/react-router";
import PcDetail from "../../../../features/product/pc/PcDetail";

export const Route = createFileRoute("/product/pc/$itemId/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <PcDetail />;
}
