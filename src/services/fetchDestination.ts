// Async API Fetch

import type { DestinationInfo } from "../models/destination.ts";
import type { RestCountryResponse } from "../models/destination.ts";

// main function: fetch cpuntry info from rest
export const getDestinationInfo = async (
  countryName: string,
): Promise<DestinationInfo> => {
  try {
    // here we fetch
    const url = `https://restcountries.com/v3.1/name/${countryName}`; // Define url for the API
    const response: Response = await fetch(url); // Here we fetch data from API
    if (!response.ok) {
      // We check if the response is OK, if not OK, we throw a new Error.
      throw new Error(`Failed to fetch destination info for url: ${url}`);
    }
    const data: RestCountryResponse[] = await response.json(); // Here we define a new list (JSON representation of the data)
    const destinationInfoData = data[0]; // The list contains the interesting data as the first element, we take this.

    if (!destinationInfoData) {
      // If we get nothing from data[0], then we throw new error since the list is empty.
      throw new Error(`No country found for ${countryName}`);
    }

    if (!destinationInfoData.currencies) {
      // We check if currency exist in data[0] (data[0] is same as destination_info_data)
      throw new Error("Currency information not available");
    }

    if (Object.keys(destinationInfoData.currencies).length === 0) {
      // We check if currencies contain any keys. Otherwise we raise error since we won't find symbol or name later.
      throw new Error("Currency information not available");
    }
    const flagUrl = destinationInfoData.flags.png;
    const currency = Object.values(destinationInfoData.currencies)[0]!; // Then we take the values, i.e., { "symbol": "kr", "name": "Swedish krona" }
    //console.log(data[0]?.flag); // try to find another value here if needed (flag)
    return {
      //another value if needed add here
      country: destinationInfoData.name.common,
      capital: destinationInfoData.capital[0] ?? "no capital found",
      currency: {
        symbol: currency.symbol,
        name: currency.name,
      },
      flag: flagUrl,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`destination error: ${error.message}`);
    }
    throw new Error("unknown error");
  }
};

/*const destInfo = await getDestinationInfo("sweden");
console.log(destInfo);*/
