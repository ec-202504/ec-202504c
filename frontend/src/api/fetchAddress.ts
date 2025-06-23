import axios from "axios";

type Address = {
  prefecture: string;
  municipalities: string;
  rest: string;
};

export const fetchAddress = async (
  zipcode: string,
): Promise<Address | null> => {
  try {
    const response = await axios.get("https://zipcoda.net/api", {
      params: { zipcode },
    });
    const items = response.data?.items;
    if (items?.length) {
      const components = items[0].components;

      const prefecture = components[0];
      const municipalities = components[1];
      const rest = components[2];

      return { prefecture, municipalities, rest };
    }
    return null;
  } catch (error) {
    console.error("住所検索エラー:", error);
    return null;
  }
};
