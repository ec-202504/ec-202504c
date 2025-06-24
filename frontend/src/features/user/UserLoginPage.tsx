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
import { ErrorAlert } from "../../components/ui/error-alert";
import { Link, useNavigate } from "@tanstack/react-router";
import { axiosInstance } from "../../lib/axiosInstance";
import { useState } from "react";
import { jwtDecoder } from "../../utils/jwtDecoder";

function UserLoginPage() {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState<string | null>(null);

  type LoginForm = {
    email: string;
    password: string;
  };

  const form = useForm<LoginForm>({
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
      navigate({ to: "/product", replace: true });
    } catch {
      // ログインエラーを全体に表示
      setLoginError(
        "ログインに失敗しました。メールアドレスとパスワードを確認してください。",
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-xl">
        <CardHeader>
          <CardTitle>ログイン</CardTitle>
        </CardHeader>
        <CardContent>
          {loginError && <ErrorAlert message={loginError} className="mb-4" />}
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        autoComplete="current-password"
                      />
                    </FormControl>
                    <FormMessage />
                    <div className="flex justify-end mt-1">
                      {/* 仮、後で作る */}
                      <Link to="/user/password-reset">
                        <span className="text-xs text-blue-600 hover:underline">
                          パスワードを忘れた方はこちら
                        </span>
                      </Link>
                    </div>
                  </FormItem>
                )}
                rules={{ required: "パスワードは必須です" }}
              />
              <Link to="/user/register">
                <span className="text-xs text-blue-600 hover:underline">
                  ユーザー登録がまだの方はこちら
                </span>
              </Link>
              <Button type="submit" className="w-full">
                ログイン
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default UserLoginPage;
