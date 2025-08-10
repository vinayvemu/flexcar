export interface Vehicle {
  id: number;
  make: string;
  model: string;
  trim: string;
  year: number;
  color: string;
  mileage: number;
  price: number;
  imageUrl: string;
  zipCode: string;
}

export type SortOptionValue = "price-high" | "price-low" | "make";

export interface SortOption {
  value: SortOptionValue;
  label: string;
}

export interface Filters {
  make: string[];
  color: string[];
}

export interface FilterOption {
  name: string;
  count: number;
}
