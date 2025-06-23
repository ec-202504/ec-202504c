import { useEffect, useState } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../components/ui/tabs";
import ProductList from "./components/ProductList";
import type { FilterTerm, Product } from "./types";
import { axiosInstance } from "../../lib/axiosInstance";
import LoadingOverlay from "./components/LoadingOverlay";

export default function ProductListPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [pcs, setPcs] = useState<Product[]>([]);
  const [techBooks, setTechBooks] = useState<Product[]>([]);
  const [filterTerms, setFilterTerms] = useState<FilterTerm[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>("pcs");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const PAGE_SIZE = 12;

  const selectedOption = (option: string) => {
    console.log(option);
  };

  //   const filterTerms: FilterTerm[] = [
  //     {
  //       id: 1,
  //       label: "OS",
  //       options: ["Mac", "Windows"],
  //     },
  //     {
  //       id: 2,
  //       label: "種類",
  //       options: ["ノートPC", "デスクトップPC"],
  //     },
  //     {
  //       id: 3,
  //       label: "用途",
  //       options: ["個人開発", "大規模開発"],
  //     },
  //     {
  //       id: 4,
  //       label: "予算",
  //       options: ["0", "100"],
  //     },
  //     {
  //       id: 5,
  //       label: "ディスプレイサイズ(インチ)",
  //       options: ["27以上", "23~26", "20~22", "17~19", "15~16", "14以下"],
  //     },
  //   ];

  //   useEffect(() => {
  //     const fetchData = async () => {
  //       setIsLoading(true);
  //       try {
  //         const response = await axiosInstance.get(`/${selectedTab}`, {
  //           params: {
  //             limit: page,
  //             offset: PAGE_SIZE,
  //             keyword: query,
  //           },
  //         });
  //         if (selectedTab === "pcs") {
  //           setPcs(response.data?.content);
  //         } else {
  //           setTechBooks(response.data?.content);
  //         }
  //         setTotalPages(response.data?.totalPages - 1 || 1);
  //       } catch (error) {
  //         console.error("APIリクエストに失敗しました:", error);
  //       } finally {
  //         setIsLoading(false);
  //       }
  //     const selectedOption = (option: string) => {
  //         console.log(option);
  //     };

  // const filterTerms: FilterTerm[] = [
  //     {
  //         id: 1,
  //         label: "OS",
  //         options: ["Mac", "Windows"],
  //     },
  //     {
  //         id: 2,
  //         label: "種類",
  //         options: ["ノートPC", "デスクトップPC"],
  //     },
  //     {
  //         id: 3,
  //         label: "用途",
  //         options: ["個人開発", "大規模開発"],
  //     },
  //     {
  //         id: 4,
  //         label: "予算",
  //         options: ["0", "100"],
  //     },
  //     {
  //         id: 5,
  //         label: "ディスプレイサイズ(インチ)",
  //         options: ["27以上", "23~26", "20~22", "17~19", "15~16", "14以下"],
  //     },
  // ];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const productListResponse = await axiosInstance.get(`/${selectedTab}`, {
          params: {
            page: page,
            size: PAGE_SIZE,
            keyword: query,
          },
        });
        console.log("LOG");
        console.log(productListResponse);
        setTotalPages(productListResponse.data?.totalPages - 1 || 1);

        if (selectedTab === "pcs") {
          setPcs(productListResponse.data?.content);
          console.log("LOG");
          console.log(productListResponse.data);
          const osListResponse = await axiosInstance.get("/pcs/oses");
          console.log("LOG");
          console.log(osListResponse);
          const cpuListResponse = await axiosInstance.get("/pcs/cpus");
          const gpuListResponse = await axiosInstance.get("/pcs/gpus");
          const purposeListResponse = await axiosInstance.get("/pcs/purposes");

          setFilterTerms([
            {
              id: 1,
              label: "OS",
              options: osListResponse.data,
            },
            {
              id: 2,
              label: "CPU",
              options: cpuListResponse.data,
            },
            {
              id: 3,
              label: "GPU",
              options: gpuListResponse.data,
            },
            {
              id: 4,
              label: "用途",
              options: purposeListResponse.data,
            },
          ]);
        } else {
          setTechBooks(productListResponse.data?.content);
          const languageListResponse =
            await axiosInstance.get("/books/languages");
          const purposeListResponse = await axiosInstance.get("/pcs/purposes");
          console.log("LOG");
          console.log(languageListResponse);
          setFilterTerms([
            {
              id: 1,
              label: "言語",
              options: languageListResponse.data,
            },
            {
              id: 2,
              label: "用途",
              options: purposeListResponse.data,
            },
          ]);
        }
      } catch (error) {
        console.error("APIリクエストに失敗しました:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedTab, page, query]);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    query: string,
  ) => {
    e.preventDefault();
    setQuery(query);
    setPage(1);
  };

  return (
    <div className="p-4 h-80vh">
      {isLoading ? (
        <LoadingOverlay />
      ) : (
        <Tabs
          value={selectedTab}
          onValueChange={(value) => {
            setSelectedTab(value);
            setFilterTerms([]);
          }}
          className="mb-4"
        >
          <TabsList>
            <TabsTrigger value="pcs">PC</TabsTrigger>
            <TabsTrigger value="books">技術書</TabsTrigger>
          </TabsList>
          <TabsContent value="pcs">
            <ProductList
              products={pcs}
              filterTerms={filterTerms}
              selectedOption={selectedOption}
              handleSubmit={handleSubmit}
              currentPage={page}
              onPageChange={setPage}
              totalPages={totalPages}
            />
          </TabsContent>
          <TabsContent value="books">
            <ProductList
              products={techBooks}
              filterTerms={filterTerms}
              selectedOption={selectedOption}
              handleSubmit={handleSubmit}
              currentPage={page}
              onPageChange={setPage}
              totalPages={totalPages}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
