import {
  createRootRoute,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";
import Header from "../components/layout/Header";
import { Toaster } from "../components/ui/sonner";
import { useEffect } from "react";
import { axiosInstance } from "../lib/axiosInstance";
import { useSetAtom } from "jotai";
import { userAtom } from "../stores/userAtom";

export const Route = createRootRoute({
  component: () => {
    const state = useRouterState();
    const currentPath = state.location.pathname;

    const showHeader =
      currentPath !== "/user/login" &&
      currentPath !== "/user/register" &&
      currentPath !== "/admin/login" &&
      currentPath !== "/admin/register";

    // レンダリングのたびに最新のユーザー情報を取得し、Global Stateに保存する
    const setUser = useSetAtom(userAtom);
    useEffect(() => {
      // TODO: JWTトークンがないならリクエストを送らない
      const fetchUser = async () => {
        try {
          const response = await axiosInstance.get("/user/me");
          setUser(response.data);
        } catch (error) {
          console.error("ユーザー情報の取得に失敗しました", error);
        }
      };
      fetchUser();
    }, [setUser]);

    return (
      <>
        {showHeader && <Header />}
        <Outlet />
        <Toaster />
      </>
    );
  },
});
