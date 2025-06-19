import { createFileRoute } from "@tanstack/react-router";
import LoginPage from "../../features/user/UserLoginPage";

export const Route = createFileRoute("/user/login")({
  component: RouteComponent,
});

function RouteComponent() {
  return <LoginPage />;
}
