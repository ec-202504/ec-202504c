import { createFileRoute } from "@tanstack/react-router";
import PcReview from "../../../../features/product/pc/PcReview";

export const Route = createFileRoute("/product/pc/$itemId/review")({
  component: RouteComponent,
});

function RouteComponent() {
  return <PcReview />;
}
