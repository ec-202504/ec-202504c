import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import type { OrderProductResponse } from "../types/order";

type OrderProductTableProps = {
  products: OrderProductResponse[];
};

export default function OrderProductTable({
  products,
}: OrderProductTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>商品名</TableHead>
          <TableHead className="text-right">数量</TableHead>
          <TableHead className="text-right">小計</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((item) => (
          <TableRow key={item.productId}>
            <TableCell className="font-medium">{item.productName}</TableCell>
            <TableCell className="text-right">{item.quantity}</TableCell>
            <TableCell className="text-right font-medium">
              ¥{item.price.toLocaleString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
