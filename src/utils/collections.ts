
import type { SaleTransaction, MenuItem, MenuCategory, Location } from "../types/models";

export function filterSalesByLocation(
  sales: SaleTransaction[],
  locationId: string
): SaleTransaction[] {
  return sales.filter((sale) => sale.locationId === locationId);
}


export function filterSalesByDateRange(
  sales: SaleTransaction[],
  startDate: Date,
  endDate: Date
): SaleTransaction[] {
  return sales.filter(
    (sale) => sale.timestamp >= startDate && sale.timestamp <= endDate
  );
}

export function filterMenuItemsByCategory(
  items: MenuItem[],
  category: MenuCategory
): MenuItem[] {
  return items.filter((item) => item.category === category);
}

export function filterActiveLocations(
  locations: Location[]
): Location[] {
  return locations.filter((location) => location.status === "Active");
}

export function sortLocationsByCapacity(
  locations: Location[],
  order: "asc" | "desc"
): Location[] {
  return [...locations].sort((a, b) =>
    order === "asc"
      ? a.seatingCapacity - b.seatingCapacity
      : b.seatingCapacity - a.seatingCapacity
  );
}

export function sortMenuItemsByPrice(
  items: MenuItem[],
  currency: "USD" | "COP",
  order: "asc" | "desc"
): MenuItem[] {
  return [...items].sort((a, b) =>
    order === "asc"
      ? a.basePrice[currency] - b.basePrice[currency]
      : b.basePrice[currency] - a.basePrice[currency]
  );
}
