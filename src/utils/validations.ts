
import type { MenuItem, SaleTransaction, Location } from "../types/models";

export function validateMenuItem(
  item: MenuItem
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (item.name.trim() === "") {
    errors.push("Menu item name cannot be empty");
  }

  if (item.basePrice.USD <= 0 || item.basePrice.COP <= 0) {
    errors.push("Base prices must be greater than zero");
  }

  if (item.ingredientCost.USD <= 0 || item.ingredientCost.COP <= 0) {
    errors.push("Ingredient costs must be greater than zero");
  }

  if (item.prepTimeMinutes <= 0 || item.prepTimeMinutes > 60) {
    errors.push("Preparation time must be between 1 and 60 minutes");
  }

  if (!item.isAvailableInColombia && !item.isAvailableInUSA) {
    errors.push("Item must be available in at least one country");
  }

  return {
    valid: errors.length === 0,
    errors: errors
  };
}

export function validateSaleTransaction(
  sale: SaleTransaction
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (sale.quantity <= 0) {
    errors.push("Quantity must be greater than zero");
  }

  if (sale.totalPrice.USD <= 0 || sale.totalPrice.COP <= 0) {
    errors.push("Both prices must be greater than zero");
  }

  if (sale.waiterName.trim() === "") {
    errors.push("Waiter name cannot be empty");
  }

  return {
    valid: errors.length === 0,
    errors: errors
  };
}

export function validateLocation(
  location: Location
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  const currentYear = new Date().getFullYear();

  if (
    location.openingYear < 2008 ||
    location.openingYear > currentYear
  ) {
    errors.push("Opening year must be between 2008 and the current year");
  }

  if (location.seatingCapacity <= 0) {
    errors.push("Seating capacity must be greater than zero");
  }

  if (location.staffCount <= 0) {
    errors.push("Staff count must be greater than zero");
  }

  if (
    location.monthlyRentCost.USD <= 0 ||
    location.monthlyRentCost.COP <= 0
  ) {
    errors.push("Monthly rent costs must be greater than zero");
  }

  if (
    location.averageMonthlyUtilities.USD <= 0 ||
    location.averageMonthlyUtilities.COP <= 0
  ) {
    errors.push("Monthly utility costs must be greater than zero");
  }

  return {
    valid: errors.length === 0,
    errors: errors
  };
}
