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

import axios, { type AxiosResponse } from "axios";
import { useState } from "react";
import { fetchAddress } from "../../api/fetchAddress";
import type { RegisterRequest } from "../../types/registerRequest";
import { useNavigate } from "@tanstack/react-router";

function UserRegisterPage() {
  const [prefecture, setPrefecture] = useState("");
  const [municipalities, setMunicipalities] = useState("");
  const navigate = useNavigate();

  const form = useForm<RegisterForm>({
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
      await axios.post<
        unknown,
        AxiosResponse<unknown, RegisterRequest>,
        RegisterRequest
      >("http://localhost:8080/user/register", requestBody);
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
      const [prefecture, municipalities, rest] = address;
      form.setValue("address", `${prefecture}${municipalities}${rest}`);
      setPrefecture(prefecture);
      setMunicipalities(municipalities);
    } else {
      alert("住所が見つかりませんでした");
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-xl">
          <CardHeader>
            <CardTitle>ユーザー登録</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
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
                        <Input {...field} />
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
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
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
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
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
                        <Input {...field} className="w-full" />
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
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  登録
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default UserRegisterPage;
