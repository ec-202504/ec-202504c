import { useForm } from "react-hook-form";
import { Button } from "../../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Link, useNavigate } from "@tanstack/react-router";
import { axiosInstance } from "../../lib/axiosInstance";
import { useState } from "react";
import { jwtDecoder } from "../../utils/jwtDecoder";
import { Alert, AlertTitle, AlertDescription } from "../../components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { PasswordInput } from "../../components/password-input";
import { TAB_VALUES } from "../product/types/constants";
import UserHeader from "./components/UserHeader";

type LoginForm = {
  email: string;
  password: string;
};

function UserLoginPage() {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState<boolean>(false);

  const form = useForm<LoginForm>({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { control, handleSubmit } = form;

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await axiosInstance.post("/user/login", data);
      const claims = jwtDecoder(response.data.token); // トークンのペイロードを取得
      const expiresAt: number = claims.exp;
      const remaining: number = Date.now() - expiresAt; // トークンの残り時間 (ms)
      localStorage.setItem("jwt_token", response.data.token);
      // トークンの残り時間が0になったらトークンを削除
      setTimeout(() => {
        localStorage.removeItem("jwt_token");
      }, remaining);
      navigate({
        to: "/product",
        search: { tab: TAB_VALUES.PC },
        replace: true,
      });
    } catch {
      // ログインエラーを全体に表示
      setLoginError(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-8">
      <UserHeader />

      <Card className="w-xl">
        <CardHeader className="pb-6">
          <CardTitle className="text-center text-xl">ログイン</CardTitle>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          {loginError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircleIcon />
              <AlertTitle>ログインに失敗しました。</AlertTitle>
              <AlertDescription>
                メールアドレスとパスワードを確認してください。
              </AlertDescription>
            </Alert>
          )}
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>メールアドレス</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" autoComplete="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                rules={{ required: "メールアドレスは必須です" }}
              />
              <FormField
                control={control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>パスワード</FormLabel>
                    <PasswordInput
                      field={field}
                      autoComplete="current-password"
                    />
                    <FormMessage />
                    <div className="flex justify-end mt-2">
                      {/* 仮、後で作る */}
                      <Link to="/user/password-reset">
                        <span className="text-sm text-blue-600 hover:underline">
                          パスワードを忘れた方はこちら
                        </span>
                      </Link>
                    </div>
                  </FormItem>
                )}
                rules={{ required: "パスワードは必須です" }}
              />
              <div className="pt-2">
                <Button type="submit" className="w-full h-11 text-base">
                  ログイン
                </Button>
              </div>
              <div className="text-center pt-4">
                <Link to="/user/register">
                  <span className="text-sm text-blue-600 hover:underline">
                    ユーザー登録がまだの方はこちら
                  </span>
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default UserLoginPage;
