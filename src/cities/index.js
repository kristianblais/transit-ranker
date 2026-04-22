import vancouver from "./vancouver";
import seattle from "./seattle";

export const CITIES = {
  [vancouver.id]: vancouver,
  [seattle.id]: seattle,
};

export const CITY_LIST = [vancouver, seattle];

export const DEFAULT_CITY_ID = vancouver.id;
