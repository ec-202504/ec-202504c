import {
  createRootRoute,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";
import Header from "../components/layout/Header";
import { Toaster } from "../components/ui/sonner";
import { axiosInstance } from "../lib/axiosInstance";
import { getDefaultStore } from "jotai";
import { userAtom } from "../stores/userAtom";
import Layout from "../components/layout/Layout";

export const Route = createRootRoute({
  beforeLoad: async () => {
    try {
      // TODO: JWTトークンがないならリクエストを送らない
      const response = await axiosInstance.get("/user/me");
      const store = getDefaultStore();
      store.set(userAtom, response.data);
    } catch (error) {
      console.error("ユーザー情報の取得に失敗しました", error);
    }
  },
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

        <Layout>
          <Outlet />
        </Layout>

        <Toaster />
      </>
    );
  },
});
