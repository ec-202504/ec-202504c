import { createFileRoute } from "@tanstack/react-router";
import UserRegisterPage from "../../features/user/UserRegisterPage";

export const Route = createFileRoute("/user/register")({
  component: RouteComponent,
});

function RouteComponent() {
  return <UserRegisterPage />;
}
