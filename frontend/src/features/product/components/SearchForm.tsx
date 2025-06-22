import { useState } from "react";
import { Button } from "../../../components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../../components/ui/command";
import { axiosInstance } from "../../../lib/axiosInstance";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";

type SearchFormProps = {
  onSubmit: (e: React.FormEvent<HTMLFormElement>, query: string) => void;
  selectedTab: string;
};

export default function SearchForm({ onSubmit, selectedTab }: SearchFormProps) {
  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  /**
   * 検索候補を取得する関数
   *
   * @param keyword 検索キーワード
   */
  const fetchSuggestions = useDebouncedCallback(async (keyword: string) => {
    if (keyword.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.get(`/${selectedTab}/suggestions`, {
        params: { keyword },
      });

      // 商品名の配列を取得（最大10件まで）
      const productNames = response.data.slice(0, 10);
      setSuggestions(productNames);
    } catch (error) {
      toast.error("検索候補の取得に失敗しました");
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, 300);

  /**
   * 入力フィールドの値が変更されたときのハンドラー
   *
   * @param value 入力フィールドの値
   */
  const handleInputChange = (value: string) => {
    setQuery(value);
    fetchSuggestions(value);
  };

  /**
   * 検索候補が選択されたときのハンドラー
   *
   * @param suggestion 選択された検索候補
   */
  const handleSuggestionSelect = (suggestion: string) => {
    setQuery(suggestion);
    setSuggestions([]); // 選択時に候補をクリア
    // 自動的に検索を実行
    onSubmit(
      new Event("submit") as unknown as React.FormEvent<HTMLFormElement>,
      suggestion,
    );
  };

  /**
   * 検索ボタンが押されたときのハンドラー
   *
   * @param e イベントオブジェクト
   */
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(e, query);
    setSuggestions([]); // 検索時に候補をクリア
  };

  return (
    <div className="mb-[10px] p-[20px] bg-gray-50 rounded-md shadow-2xs">
      <form onSubmit={handleFormSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Command className="rounded-lg border shadow-sm">
            <CommandInput
              placeholder="キーワードを入力してください"
              value={query}
              onValueChange={handleInputChange}
              className="h-10"
            />

            {loading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900" />
              </div>
            )}

            {suggestions.length > 0 && (
              <CommandList className="max-h-[200px]">
                <CommandEmpty>検索結果が見つかりません</CommandEmpty>
                <CommandGroup>
                  {suggestions.map((suggestion) => (
                    <CommandItem
                      key={suggestion}
                      value={suggestion}
                      onSelect={() => handleSuggestionSelect(suggestion)}
                      className="cursor-pointer"
                    >
                      <Search className="mr-2 h-4 w-4" />
                      {suggestion}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            )}
          </Command>
        </div>

        <Button type="submit">検索</Button>
      </form>
    </div>
  );
}
