import { createFileRoute } from "@tanstack/react-router";
import UserLoginPage from "../../features/user/UserLoginPage";

export const Route = createFileRoute("/user/login")({
  component: RouteComponent,
});

function RouteComponent() {
  return <UserLoginPage />;
}
