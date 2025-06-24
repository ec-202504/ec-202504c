import type { Pc } from "../../product/types/Pc";
import type { Book } from "../../product/types/Book";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type SpecTableProps = {
  products: (Pc | Book)[];
  productCategory: "pc" | "book";
};

const pcSpecs = {
  OS: "os",
  プロセッサ: "cpu",
  グラフィックス: "gpu",
  メモリ: "memory",
  ストレージ: "storage",
  ディスプレイサイズ: "deviceSize",
  デバイスの種類: "deviceType",
  用途: "purpose",
} as const;

const bookSpecs = {
  著者: "author",
  発売日: "publishDate",
  プログラミング言語: "language",
  用途: "purpose",
} as const;

function SpecTable({ products, productCategory }: SpecTableProps) {
  /**
   * 商品の仕様テーブルのキーを取得
   *
   * @param products 商品
   * @returns 仕様キー
   */
  const getSpecKeys = (products: (Pc | Book)[]) => {
    if (products.length === 0) return [];
    return Object.keys(productCategory === "pc" ? pcSpecs : bookSpecs);
  };

  return (
    <>
      {products.length > 0 && (
        <div className="overflow-x-auto">
          <Table className="w-full border-collapse">
            <TableHeader>
              <TableRow className="border-b">
                <TableHead className="text-left p-4 font-medium bg-muted/50">
                  仕様
                </TableHead>

                {products.map((product) => (
                  <TableHead
                    key={
                      productCategory === "pc"
                        ? (product as Pc).pcId
                        : (product as Book).bookId
                    }
                    className="text-left p-4 font-medium bg-muted/50"
                  >
                    {product.name}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {getSpecKeys(products).map((specKey) => (
                <TableRow key={specKey} className="border-b">
                  <TableCell className="p-4 font-medium bg-muted/30">
                    {specKey}
                  </TableCell>
                  {products.map((product) => (
                    <TableCell
                      key={
                        productCategory === "pc"
                          ? (product as Pc).pcId
                          : (product as Book).bookId
                      }
                      className="p-4"
                    >
                      {productCategory === "pc"
                        ? (product as Pc)[
                            pcSpecs[specKey as keyof typeof pcSpecs]
                          ]
                        : (product as Book)[
                            bookSpecs[specKey as keyof typeof bookSpecs]
                          ] || "-"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}

export default SpecTable;
