/**
 * 検索フォームの送信ハンドラー
 */
export const createSearchSubmitHandler = (
  handleSearch: (query: string) => void,
) => {
  return (e: React.FormEvent<HTMLFormElement>, query: string) => {
    e.preventDefault();
    handleSearch(query);
  };
};
