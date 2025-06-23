import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Separator } from "../../../components/ui/separator";
import { Calendar } from "lucide-react";
import { formatDeliveryTime } from "../utils/formatFrontDate";
import { formatToTimezoneDate } from "../../../utils/formatToFrontDate";

type OrderInfoCardProps = {
  orderDate: string;
  deliveryDate: string;
  totalPrice: number;
};

export default function OrderInfoCard({
  orderDate,
  deliveryDate,
  totalPrice,
}: OrderInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          注文情報
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">注文日時</span>
          <span className="font-medium">{formatToTimezoneDate(orderDate)}</span>
        </div>
        <Separator />
        <div className="flex justify-between items-center">
          <span className="text-gray-600">お届け予定日</span>
          <Badge variant="secondary" className="text-green-700 bg-green-100">
            {formatDeliveryTime(deliveryDate)}
          </Badge>
        </div>
        <Separator />
        <div className="flex justify-between items-center">
          <span className="text-gray-600">合計金額</span>
          <span className="text-2xl font-bold text-green-600">
            ¥{totalPrice.toLocaleString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
