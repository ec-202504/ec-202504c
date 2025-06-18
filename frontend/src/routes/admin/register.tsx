import { createFileRoute } from "@tanstack/react-router";
import AdminRegisterPage from "../../features/admin/AdminRegisterPage";

export const Route = createFileRoute("/admin/register")({
  component: RouteComponent,
});

function RouteComponent() {
  return <AdminRegisterPage />;
}
