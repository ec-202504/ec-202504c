import axios from "axios";

export const fetchAddress = async (zipcode: string): Promise<string | null> => {
  try {
    const response = await axios.get("https://zipcoda.net/api", {
      params: { zipcode },
    });
    const items = response.data?.items;
    if (items?.length) {
      return items[0].components;
    }
    return null;
  } catch (error) {
    console.error("住所検索エラー:", error);
    return null;
  }
};
