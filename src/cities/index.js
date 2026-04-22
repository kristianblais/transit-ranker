import vancouver from "./vancouver";
import seattle from "./seattle";

export const CITIES = {
  [vancouver.city_id]: vancouver,
  [seattle.city_id]: seattle,
};

export const CITY_LIST = [vancouver, seattle];

export const DEFAULT_CITY_ID = vancouver.city_id;
