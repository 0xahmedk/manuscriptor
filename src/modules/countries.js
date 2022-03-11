import countryList from "react-select-country-list";

const countries = countryList()
  .getData()
  .map((c) => c.label);

const findCountryByShortCode = countries;

export { countries, findCountryByShortCode };
