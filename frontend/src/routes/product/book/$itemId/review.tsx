import { createFileRoute } from "@tanstack/react-router";
import BookReview from "../../../../features/product/book/BookReview";

export const Route = createFileRoute("/product/book/$itemId/review")({
  component: RouteComponent,
});

function RouteComponent() {
  return <BookReview />;
}
