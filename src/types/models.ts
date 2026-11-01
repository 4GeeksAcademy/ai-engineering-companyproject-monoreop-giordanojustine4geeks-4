export interface MenuItem {
  id: string; // Menu item ID (e.g., "ITEM-PICANHA-250")
  name: string; // Item name (e.g., "Picanha 250g")
  category: MenuCategory; // Food category
  basePrice: Price; // Base price (can vary by location)
  ingredientCost: Price; // Cost of ingredients per unit
  prepTimeMinutes: number; // Average preparation time
  isAvailableInColombia: boolean;
  isAvailableInUSA: boolean;
  allergens: string[]; // List of allergens
  status: MenuItemStatus;
}

export interface Price {
  USD: number; // Price in US Dollars
  COP: number; // Price in Colombian Pesos
}

export type MenuCategory = "Meat" | "Side" | "Beverage" | "Dessert" | "Combo";
export type MenuItemStatus = "Active" | "Seasonal" | "Discontinued";

export interface SaleTransaction {
  id: string; // Transaction ID (e.g., "TXN-2024-15482")
  locationId: string; // Location where sale occurred
  itemId: string; // Menu item sold
  quantity: number; // Number of units sold
  totalPrice: Price; // Total price charged
  paymentMethod: PaymentMethod; // How customer paid
  timestamp: Date; // When the sale occurred
  waiterName: string; // Staff member who served
}

export type PaymentMethod = "Cash" | "Credit card" | "Debit card" | "Digital wallet";

export interface Location {
  id: string; // Location ID (e.g., "LOC-MEDELLIN-01")
  name: string; // Location name
  city: string; // City name
  country: Country; // Colombia or USA
  openingYear: number; // Year opened
  seatingCapacity: number; // Maximum number of customers
  staffCount: number; // Number of employees
  monthlyRentCost: Price; // Monthly rent
  averageMonthlyUtilities: Price; // Average monthly utilities
  manager: string; // Location manager name
  status: LocationStatus;
}

export type Country = "Colombia" | "USA";
export type LocationStatus = "Active" | "Temporarily closed" | "Under renovation";

export interface WasteRecord {
  id: string; // Waste record ID
  locationId: string; // Location where waste occurred
  itemId: string; // Menu item wasted
  quantity: number; // Number of units wasted
  reason: WasteReason; // Why it was wasted
  cost: Price; // Cost of wasted items
  timestamp: Date; // When it was recorded
  reportedBy: string; // Staff member who reported it
}

export type WasteReason =
  | "Expired"
  | "Cooking error"
  | "Customer return"
  | "Damage"
  | "Other";
        
export interface CountryMetrics {
  totalLocations: number;
  totalRevenue: Price;
  averageRevenuePerLocation: Price;
  totalSales: number;
}