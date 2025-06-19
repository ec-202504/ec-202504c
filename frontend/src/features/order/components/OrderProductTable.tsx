import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";

type OrderProduct = {
  name: string;
  quantity: number;
  subtotal: number;
};

type OrderProductTableProps = {
  products: OrderProduct[];
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
          <TableRow key={item.name}>
            <TableCell className="font-medium">{item.name}</TableCell>
            <TableCell className="text-right">{item.quantity}</TableCell>
            <TableCell className="text-right font-medium">
              ¥{item.subtotal.toLocaleString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
