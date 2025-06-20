import {
  createRootRoute,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";
import Header from "../components/layout/Header";

export const Route = createRootRoute({
  component: () => {
    const state = useRouterState();
    const currentPath = state.location.pathname;

    const showHeader =
      currentPath !== "/user/login" &&
      currentPath !== "/user/register" &&
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
