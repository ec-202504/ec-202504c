import { createFileRoute } from "@tanstack/react-router";
import TopPage from "../features/TopPage";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return <TopPage />;
}
