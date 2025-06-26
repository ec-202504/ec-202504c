import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { userAtom } from "../../stores/userAtom";
import { TAB_VALUES } from "../../features/product/types/constants";
import {
  Monitor,
  ShoppingCart,
  LogOut,
  LogIn,
  UserPlus,
  BarChart3,
  History,
  ShoppingBag,
} from "lucide-react";

function Header() {
  const navigate = useNavigate();
  const user = useAtomValue(userAtom);

  const handleLogout = async () => {
    try {
      localStorage.removeItem("jwt_token");
      navigate({ to: "/user/login", replace: true });
    } catch (error) {
      console.error("ログアウトに失敗しました", error);
    }
  };

  return (
    <header className="w-full px-4 py-3 flex items-center bg-white shadow-sm border-b border-slate-200 dark:bg-slate-900 dark:border-slate-700">
      <div className="text-xl font-semibold">
        <Link
          to="/"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity group"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-primary via-primary/90 to-primary/70 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-gray-900 dark:text-white font-black bg-gradient-to-r from-primary via-primary/90 via-primary/70 to-primary/50 bg-clip-text text-transparent text-xl">
              Tech Mate
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wide">
              初心者に寄り添う
            </span>
          </div>
        </Link>
      </div>

      <Separator orientation="vertical" className="h-8 mx-4" />

      <nav className="flex items-center gap-4 ml-auto">
        <Link
          to="/product"
          search={{ tab: TAB_VALUES.PC }}
          className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
        >
          <Monitor className="w-4 h-4" />
          <span className="hidden sm:inline">商品一覧</span>
          <span className="sm:hidden">商品</span>
        </Link>

        <Link
          to="/product/comparison"
          className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
        >
          <BarChart3 className="w-4 h-4" />
          <span className="hidden sm:inline">比較</span>
        </Link>

        <Link
          to="/cart"
          className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
        >
          <ShoppingCart className="w-4 h-4" />
          <span className="hidden sm:inline">カート</span>
        </Link>

        <Link
          to="/order/history"
          className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
        >
          <History className="w-4 h-4" />
          <span className="hidden sm:inline">注文履歴</span>
          <span className="sm:hidden">履歴</span>
        </Link>

        <Separator orientation="vertical" className="h-6" />

        {user ? (
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex items-center gap-1.5 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">ログアウト</span>
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/user/login">
              <Button
                variant="outline"
                className="flex items-center gap-1.5 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">ログイン</span>
              </Button>
            </Link>
            <Link to="/user/register">
              <Button
                variant="default"
                className="flex items-center gap-1.5 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              >
                <UserPlus className="w-4 h-4" />
                <span className="hidden sm:inline">新規登録</span>
              </Button>
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;
