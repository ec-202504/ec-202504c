import { format } from "date-fns";
import { ja } from "date-fns/locale";

/**
 * 配達予定時刻をフォーマットする
 * バックエンドではUTC(タイムゾーンなし)で返却されるため、Zを追加してUTCからJSTに変換する
 *
 * @param dateTimeString 配達予定時刻
 * @returns フォーマットされた配達予定時刻
 */
export const formatDeliveryTime = (dateTimeString: string) => {
  const date = new Date(`${dateTimeString}Z`);
  return format(date, "M月d日 H時", { locale: ja });
};

/**
 * 注文日時をフォーマットする
 * バックエンドではUTC(タイムゾーンなし)で返却されるため、Zを追加してUTCからJSTに変換する
 *
 * @param dateTimeString 注文日時
 * @returns フォーマットされた注文日時
 */
export const formatOrderDate = (dateTimeString: string) => {
  const date = new Date(`${dateTimeString}Z`);
  return format(date, "yyyy年M月d日 H:mm:ss", { locale: ja });
};
