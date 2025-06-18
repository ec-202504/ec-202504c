import { createFileRoute } from "@tanstack/react-router";
import BookDetail from "../../../../features/product/book/BookDetail";

export const Route = createFileRoute("/product/book/$itemId/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <BookDetail />;
}
