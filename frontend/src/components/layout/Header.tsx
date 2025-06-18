import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useState } from "react";
import { Link } from "@tanstack/react-router";

function Header() {
  const [isLogin, setIsLogin] = useState(false);

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
          <Button variant="outline">ログアウト</Button>
        ) : (
          <>
            <Link to="/login">
              <Button variant="outline" className="mr-0.5">
                ログイン
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="default">新規登録</Button>
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
