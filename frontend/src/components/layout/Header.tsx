import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { userAtom } from "../../stores/userAtom";
import { TAB_VALUES } from "../../features/product/types/constants";

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
    <header className="w-full px-4 py-3 flex items-center bg-white shadow">
      <div className="text-xl font-semibold">
        <Link to="/product" search={{ tab: TAB_VALUES.PC }}>
          ECサイト
        </Link>
      </div>

      <Separator orientation="vertical" className="h-6 mx-4" />

      <nav className="flex items-center gap-3 ml-auto">
        <Link
          to="/product"
          search={{ tab: TAB_VALUES.PC }}
          className="hover:underline"
        >
          商品一覧
        </Link>

        <Link to="/product/comparison" className="hover:underline">
          商品比較
        </Link>

        <Link to="/cart" className="hover:underline">
          カート
        </Link>

        <Link to="/order/history" className="hover:underline">
          注文履歴
        </Link>

        <div className="h-5 mx-2">
          <Separator orientation="vertical" />
        </div>

        {user ? (
          <Button variant="outline" onClick={handleLogout}>
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
