import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { useState } from "react";

type Props = {
  onSubmit: (e: React.FormEvent<HTMLFormElement>, query: string) => void;
};

export default function SearchForm({ onSubmit }: Props) {
  const [query, setQuery] = useState<string>("");
  return (
    <form
      onSubmit={(e) => onSubmit(e, query)}
      method="post"
      className="flex gap-2 mb-[10px] p-[20px] bg-gray-50 rounded-md shadow-2xs"
    >
      <Input
        name="query"
        type="text"
        placeholder="キーワードを入力してください"
        className="bg-white"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button type="submit">検索</Button>
    </form>
  );
}
