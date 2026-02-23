export type Currency = {
  // if we want to add another key value pair I do it here
  symbol: string;
  name: string;
};

export type DestinationInfo = {
  country: string;
  capital: string;
  currency: Currency;
  flag: string;
};

export type RestCountryResponse = {
  // defined RestCountryRespone to avoid implicit any
  currencies: Record<string, Currency>;
  name: {
    common: string;
  };
  capital: string[];
  flags: {
    png: string;
  };
};
