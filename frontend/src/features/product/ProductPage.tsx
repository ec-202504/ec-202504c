import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../components/ui/tabs";
import type { FilterTerm } from "./components/Sidebar";
import ProductList from "./components/ProductList";

export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
};

export default function ProductListPage() {
  const selectedOption = (option: string) => {
    console.log(option);
  };

  const pcs: Product[] = [
    {
      id: "1",
      name: "デスクトップPC Alpha",
      price: 98000,
      image: "https://via.placeholder.com/150?text=Alpha+PC",
    },
    {
      id: "2",
      name: "ゲーミングノート Zeta",
      price: 148000,
      image: "https://via.placeholder.com/150?text=Zeta+Gaming",
    },
    {
      id: "3",
      name: "クリエイター向けPC Creator-X",
      price: 198000,
      image: "https://via.placeholder.com/150?text=Creator+X",
    },
    {
      id: "4",
      name: "ビジネスノート BizLite",
      price: 86000,
      image: "https://via.placeholder.com/150?text=BizLite",
    },
    {
      id: "5",
      name: "ミニPC CubeOne",
      price: 56000,
      image: "https://via.placeholder.com/150?text=CubeOne",
    },
  ];

  const techBooks: Product[] = [
    {
      id: "101",
      name: "React完全ガイド",
      price: 3960,
      image: "https://via.placeholder.com/150?text=React+Guide",
    },
    {
      id: "102",
      name: "実践TypeScript",
      price: 3520,
      image: "https://via.placeholder.com/150?text=TypeScript",
    },
    {
      id: "103",
      name: "モダンJavaScriptの教科書",
      price: 3080,
      image: "https://via.placeholder.com/150?text=JavaScript",
    },
    {
      id: "104",
      name: "Spring Boot入門",
      price: 4290,
      image: "https://via.placeholder.com/150?text=Spring+Boot",
    },
    {
      id: "105",
      name: "ドメイン駆動設計入門",
      price: 4950,
      image: "https://via.placeholder.com/150?text=DDD+入門",
    },
  ];

  const filterTerms: FilterTerm[] = [
    {
      id: 1,
      label: "OS",
      options: ["Mac", "Windows"],
    },
    {
      id: 2,
      label: "種類",
      options: ["ノートPC", "デスクトップPC"],
    },
    {
      id: 3,
      label: "用途",
      options: ["個人開発", "大規模開発"],
    },
    {
      id: 4,
      label: "予算",
      options: ["0", "100"],
    },
    {
      id: 5,
      label: "ディスプレイサイズ(インチ)",
      options: ["0", "100"],
    },
  ];

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    query: string,
  ) => {
    e.preventDefault(); // ページ遷移を防ぐ
    console.log(query);
  };

  return (
    <div className="p-4">
      <Tabs defaultValue="pc" className="mb-4">
        <TabsList>
          <TabsTrigger value="pc">PC</TabsTrigger>
          <TabsTrigger value="tech">技術書</TabsTrigger>
        </TabsList>
        <TabsContent value="pc">
          <ProductList
            products={pcs}
            filterTerms={filterTerms}
            selectedOption={selectedOption}
            handleSubmit={handleSubmit}
          />
        </TabsContent>
        <TabsContent value="tech">
          <ProductList
            products={techBooks}
            filterTerms={filterTerms}
            selectedOption={selectedOption}
            handleSubmit={handleSubmit}
          />
          {/* <div className="flex gap-4">
                        <Sidebar
                            selectedOption={selectedOption}
                            filterTerms={filterTerms}
                        />
                        <SearchForm onSubmit={handleSubmit} />
                        <div className="grid grid-cols-3 gap-4">
                            {techBooks.map((product) => (
                                <ProductCard
                                    product={product}
                                    key={product.id}
                                />
                            ))}
                        </div>
                        <div className="flex justify-between w-full mt-3">
                            <div className="mr-auto">
                                <Button type="button" variant={"outline"}>
                                    戻る
                                </Button>
                            </div>
                            <div className="ml-auto">
                                <Button type="button">次へ</Button>
                            </div>
                        </div>
                    </div> */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
