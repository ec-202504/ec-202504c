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
import { TAB_VALUES, type TabValues } from "../../product/types/constants";
import { DEVICE_TYPE_LABEL, type DeviceType } from "../../../types/constants";

type SpecTableProps = {
  products: (Pc | Book)[];
  productCategory: TabValues;
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
    return Object.keys(productCategory === TAB_VALUES.PC ? pcSpecs : bookSpecs);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-muted/50 border-b border-border">
            <th className="px-6 py-4 text-left font-semibold text-foreground min-w-[200px]">
              比較項目
            </th>
            {products.map((product) => (
              <th
                key={
                  productCategory === TAB_VALUES.PC
                    ? (product as Pc).pcId
                    : (product as Book).bookId
                }
                className="px-6 py-4 text-left font-semibold text-foreground min-w-[150px]"
              >
                {product.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {getSpecKeys(products).map((specKey) => (
            <tr key={specKey} className="border-b border-border/50">
              <th className="p-4 font-medium text-left bg-muted/20">
                {specKey}
              </th>
              {products.map((product) => (
                <td
                  key={
                    productCategory === TAB_VALUES.PC
                      ? (product as Pc).pcId
                      : (product as Book).bookId
                  }
                  className="p-4"
                >
                  {productCategory === TAB_VALUES.PC
                    ? (() => {
                        const value = (product as Pc)[
                          pcSpecs[specKey as keyof typeof pcSpecs]
                        ];
                        if (specKey === "メモリ" || specKey === "ストレージ") {
                          if (value !== undefined && value !== null) {
                            if (typeof value === "number" && value >= 1024) {
                              const tb = value / 1024;
                              return `${tb % 1 === 0 ? tb : tb.toFixed(1)}TB`;
                            }
                            return `${value}GB`;
                          }
                          return "-";
                        }
                        if (specKey === "ディスプレイサイズ") {
                          return value !== undefined && value !== null
                            ? `${value}インチ`
                            : "-";
                        }
                        if (specKey === "デバイスの種類") {
                          return value in DEVICE_TYPE_LABEL
                            ? DEVICE_TYPE_LABEL[value as DeviceType]
                            : "-";
                        }
                        return value ?? "-";
                      })()
                    : (product as Book)[
                        bookSpecs[specKey as keyof typeof bookSpecs]
                      ] || "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SpecTable;
