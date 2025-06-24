import type { ComparisonPc, ComparisonBook } from "../types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type SpecTableProps = {
  products: (ComparisonPc | ComparisonBook)[];
  productCategory: "pc" | "book";
};

function SpecTable({ products, productCategory }: SpecTableProps) {
  /**
   * 商品の仕様テーブルのキーを取得
   *
   * @param products 商品
   * @returns 仕様キー
   */
  const getSpecKeys = (products: (ComparisonPc | ComparisonBook)[]) => {
    if (products.length === 0) return [];
    return Object.keys(products[0].specs);
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
                        ? (product as ComparisonPc).pcId
                        : (product as ComparisonBook).bookId
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
                          ? (product as ComparisonPc).pcId
                          : (product as ComparisonBook).bookId
                      }
                      className="p-4"
                    >
                      {product.specs[specKey as keyof typeof product.specs] ||
                        "-"}
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
