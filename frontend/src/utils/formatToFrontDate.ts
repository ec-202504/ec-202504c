import { format } from "date-fns";
import { ja } from "date-fns/locale";

/**
 * バックエンドのLocalDateTimeをフォーマットする
 *
 * @param dateTimeString 日時
 * @returns フォーマットされた日時(JST)
 */
export const formatToTimezoneDate = (dateTimeString: string) => {
  const date = new Date(`${dateTimeString}Z`);
  return format(date, "yyyy年M月d日 H:mm:ss", { locale: ja });
};
