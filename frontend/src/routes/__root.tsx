import { createRootRoute, Outlet, useRouter } from "@tanstack/react-router";
import Header from "../components/layout/Header";

export const Route = createRootRoute({
  component: () => {
    const { state } = useRouter();
    const currentPath = state.location.pathname;

    const showHeader =
      currentPath !== "/login" &&
      currentPath !== "/register" &&
      currentPath !== "/admin/login" &&
      currentPath !== "/admin/register";

    return (
      <>
        {showHeader && <Header />}
        <Outlet />
      </>
    );
  },
});
