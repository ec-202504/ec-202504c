import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/user/logout")({
  component: LogoutPage,
});

function LogoutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">ログアウト</h1>
      <p>ログアウト処理中...</p>
    </div>
  );
}
