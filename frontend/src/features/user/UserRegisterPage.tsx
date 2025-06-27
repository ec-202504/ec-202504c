import { useForm } from "react-hook-form";
import type { RegisterForm } from "./schema/registerFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerFormSchema } from "./schema/registerFormSchema";

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
import { PasswordInput } from "../../components/password-input";

import type { AxiosResponse } from "axios";
import { useState } from "react";
import { fetchAddress } from "../../api/fetchAddress";
import type { RegisterRequest } from "../../types/registerRequest";
import { useNavigate, Link } from "@tanstack/react-router";
import { axiosInstance } from "../../lib/axiosInstance";
import UserHeader from "./components/UserHeader";

function UserRegisterPage() {
  const [prefecture, setPrefecture] = useState("");
  const [municipalities, setMunicipalities] = useState("");
  const navigate = useNavigate();

  const form = useForm<RegisterForm>({
    mode: "onChange",
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      zipcode: "",
      address: "",
      telephone: "",
    },
  });

  const onSubmit = async (data: RegisterForm) => {
    const requestBody: RegisterRequest = {
      ...data,
      zipcode: data.zipcode.replace("-", ""),
      telephone: data.telephone.replace("-", ""),
      prefecture: prefecture,
      municipalities: municipalities,
    };
    try {
      await axiosInstance.post<
        unknown,
        AxiosResponse<unknown, RegisterRequest>,
        RegisterRequest
      >("/user/register", requestBody);
      navigate({ to: "/user/login", replace: true });
    } catch (error) {
      console.error("登録に失敗しました", error);
    }
  };

  const handleFetchAddress = async () => {
    const isValid = await form.trigger("zipcode");
    if (!isValid) {
      return;
    }

    const address = await fetchAddress(form.getValues("zipcode"));
    if (address) {
      form.setValue(
        "address",
        `${address.prefecture}${address.municipalities}${address.rest}`,
      );
      setPrefecture(address.prefecture);
      setMunicipalities(address.municipalities);
    } else {
      form.setError("zipcode", {
        message: "住所が見つかりませんでした",
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-12">
      <UserHeader />

      <Card className="w-xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-center text-2xl">ユーザー登録</CardTitle>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>名前</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>メールアドレス</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="techmate@example.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>パスワード</FormLabel>
                    <PasswordInput
                      field={field}
                      placeholder="英大文字・小文字・数字・記号を含む8文字以上16文字以下"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>確認用パスワード</FormLabel>
                    <PasswordInput field={field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="zipcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>郵便番号</FormLabel>
                    <div className="flex gap-2">
                      <Input
                        {...field}
                        className="w-full"
                        placeholder="123-4567"
                      />
                      <Button
                        type="button"
                        onClick={handleFetchAddress}
                        variant="outline"
                        className="whitespace-nowrap"
                      >
                        住所取得
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>住所</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="telephone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>電話番号</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="090-1234-5678" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="pt-2">
                <Button type="submit" className="w-full h-11 text-base">
                  登録
                </Button>
              </div>
              <div className="text-center pt-4">
                <Link
                  to="/user/login"
                  className="text-sm text-primary hover:underline"
                >
                  ログイン画面はこちら
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default UserRegisterPage;
