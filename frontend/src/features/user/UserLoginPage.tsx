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

function UserLoginPage() {
  const navigate = useNavigate();

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

  const { control, handleSubmit, setError } = form;

  const onSubmit = async (data: LoginForm) => {
    try {
      await axiosInstance.post("/user/login", data);
      navigate({ to: "/product", replace: true });
    } catch {
      setError("email", { message: "ログインに失敗しました" });
      setError("password", { message: "ログインに失敗しました" });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* 良い感じのロゴ */}
      <Link to="/product">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">TechMate</h1>
          <p className="text-gray-600 mb-4">技術書とPCの専門店</p>
        </div>
      </Link>

      <Card className="w-xl">
        <CardHeader>
          <CardTitle>ログイン</CardTitle>
        </CardHeader>
        <CardContent>
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
                        <span className="text-sm text-blue-600 hover:underline">
                          パスワードを忘れた方はこちら
                        </span>
                      </Link>
                    </div>
                  </FormItem>
                )}
                rules={{ required: "パスワードは必須です" }}
              />
              <Link to="/user/register">
                <span className="text-sm text-blue-600 hover:underline">
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
