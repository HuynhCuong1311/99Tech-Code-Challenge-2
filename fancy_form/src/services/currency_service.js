import { api } from "../utils/api";

export const currencyService = {
  getCurrencyList: async () => {
    const response = await api.get(
      "https://interview.switcheo.com/prices.json"
    );
    return response.data;
  },
};
