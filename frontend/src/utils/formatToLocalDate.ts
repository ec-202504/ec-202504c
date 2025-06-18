import { format } from "date-fns";

/**
 * フロントのdateをバックエンドのdateに変換する
 *
 * @param date フロントの日時
 * @returns バックエンドの日時
 */
export const formatToLocalDate = (date: Date) => {
  return format(date, "yyyy-MM-dd'T'HH:mm:ss");
};
