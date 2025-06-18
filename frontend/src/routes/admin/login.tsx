import { createFileRoute } from "@tanstack/react-router";
import AdminLoginPage from "../../features/admin/AdminLoginPage";

export const Route = createFileRoute("/admin/login")({
  component: RouteComponent,
});

function RouteComponent() {
  return <AdminLoginPage />;
}
