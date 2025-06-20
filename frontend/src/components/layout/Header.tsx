import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import axios from "axios";
import { axiosInstance } from "../../lib/axiosInstance";

function Header() {
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axiosInstance.get("/user/me");
        if (response.status === 200) {
          setIsLogin(true);
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          setIsLogin(false);
        }
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <header className="w-full px-4 py-3 flex items-center bg-white shadow">
      <div className="text-xl font-semibold">
        <Link to="/product">ECサイト</Link>
      </div>

      <Separator orientation="vertical" className="h-6 mx-4" />

      <nav className="flex items-center gap-3 ml-auto">
        <Link to="/product/recommend" className="hover:underline">
          レコメンド
        </Link>
        <Link to="/order/history" className="hover:underline">
          注文履歴
        </Link>
        <Link to="/cart" className="hover:underline">
          カート
        </Link>

        <div className="h-5 mx-2">
          <Separator orientation="vertical" />
        </div>

        {isLogin ? (
          <Button
            variant="outline"
            onClick={async () => {
              try {
                await axiosInstance.post("/user/logout");
                setIsLogin(false);
                navigate({ to: "/user/login", replace: true });
              } catch (error) {
                console.error("Logout failed:", error);
              }
            }}
          >
            ログアウト
          </Button>
        ) : (
          <>
            <Link to="/user/login">
              <Button variant="outline" className="mr-0.5">
                ログイン
              </Button>
            </Link>
            <Link to="/user/register">
              <Button variant="default">新規登録</Button>
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
