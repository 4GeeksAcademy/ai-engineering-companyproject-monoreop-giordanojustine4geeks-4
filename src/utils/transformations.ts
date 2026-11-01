import type { SaleTransaction, MenuItem, WasteRecord, Location, PaymentMethod, WasteReason, CountryMetrics } from "../types/models";

export function calculateDailyRevenue(
  sales: SaleTransaction[],
  date: Date,
  currency: "USD" | "COP"
): number {
  const dailySales = sales.filter(
    (sale) =>
      sale.timestamp.getFullYear() === date.getFullYear() &&
      sale.timestamp.getMonth() === date.getMonth() &&
      sale.timestamp.getDate() === date.getDate()
      
  );

  const total = dailySales.reduce(
    (sum, sale) => sum + sale.totalPrice[currency],
    0
  );

  return Math.round(total * 100) / 100;
}

export function calculateLocationMargin(
  sales: SaleTransaction[],
  menuItems: MenuItem[],
  locationId: string,
  currency: "USD" | "COP"
): number {
  const locationSales = sales.filter(
    (sale) => sale.locationId === locationId
  );

  const totalRevenue = locationSales.reduce(
    (sum, sale) => sum + sale.totalPrice[currency],
    0
  );

  const totalIngredientCost = locationSales.reduce((sum, sale) => {
    const item = menuItems.find(
      (item) => item.id === sale.itemId
    );

    if (!item) {
      return sum;
    }

    return sum + item.ingredientCost[currency] * sale.quantity;
  }, 0);

  if (totalRevenue === 0) {
    return 0;
  }

  const margin =
    ((totalRevenue - totalIngredientCost) / totalRevenue) * 100;

  return Math.round(margin * 100) / 100;
}

export function calculateWasteCost(
  wasteRecords: WasteRecord[],
  locationId: string,
  currency: "USD" | "COP"
): number {
  const locationWaste = wasteRecords.filter(
    (record) => record.locationId === locationId
  );

  const totalCost = locationWaste.reduce(
    (sum, record) => sum + record.cost[currency],
    0
  );

  return Math.round(totalCost * 100) / 100;
}

export function convertCurrency(
  amount: number,
  fromCurrency: "USD" | "COP",
  toCurrency: "USD" | "COP"
): number {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  let convertedAmount: number;

  if (fromCurrency === "USD") {
    convertedAmount = amount * 4000;
  } else {
    convertedAmount = amount / 4000;
  }

  return Math.round(convertedAmount * 100) / 100;
}

export function scoreLocationPerformance(
  location: Location,
  sales: SaleTransaction[],
  wasteRecords: WasteRecord[],
  menuItems: MenuItem[]
): number {
  const locationSales = sales.filter(
    (sale) => sale.locationId === location.id
  );

  const totalRevenue = locationSales.reduce(
    (sum, sale) => sum + sale.totalPrice.USD,
    0
  );

  const operatingDays = Math.max(
    1,
    (new Date().getFullYear() - location.openingYear) * 365
  );

  const averageDailyRevenue = totalRevenue / operatingDays;

  const revenueScore = Math.min(
    (averageDailyRevenue / 1000) * 40,
    40
  );

  const efficiencyScore = Math.min(
    (locationSales.length / location.seatingCapacity) * 30,
    30
  );

  const totalWaste = calculateWasteCost(
    wasteRecords,
    location.id,
    "USD"
  );

  const wastePercentage =
    totalRevenue > 0 ? (totalWaste / totalRevenue) * 100 : 0;

  const wasteScore = Math.max(
    0,
    20 - wastePercentage * 2
  );

  const margin = calculateLocationMargin(
    sales,
    menuItems,
    location.id,
    "USD"
  );

  const marginScore = Math.min(margin / 10, 10);

  const totalScore =
    revenueScore +
    efficiencyScore +
    wasteScore +
    marginScore;

  return Math.round(totalScore * 100) / 100;
}

export function rankLocationsByPerformance(
  locations: Location[],
  sales: SaleTransaction[],
  wasteRecords: WasteRecord[],
  menuItems: MenuItem[]
): Array<{ location: Location; score: number }> {
  return locations
    .map((location) => ({
      location,
      score: scoreLocationPerformance(
        location,
        sales,
        wasteRecords,
        menuItems
      ),
    }))
    .sort((a, b) => b.score - a.score);
}

export function countSalesByPaymentMethod(
  sales: SaleTransaction[]
): Record<PaymentMethod, number> {
  const counts: Record<PaymentMethod, number> = {
    Cash: 0,
    "Credit card": 0,
    "Debit card": 0,
    "Digital wallet": 0
  };

  sales.forEach((sale) => {
    counts[sale.paymentMethod] += 1;
  });

  return counts;
}

export function calculateAverageTicket(
  sales: SaleTransaction[],
  currency: "USD" | "COP"
): number {
  if (sales.length === 0) {
    return 0;
  }

  const totalRevenue = sales.reduce(
    (sum, sale) => sum + sale.totalPrice[currency],
    0
  );

  const average = totalRevenue / sales.length;

  return Math.round(average * 100) / 100;
}

export function findTopSellingItems(
  sales: SaleTransaction[],
  menuItems: MenuItem[],
  topN: number
): Array<{ item: MenuItem; totalSold: number }> {
  const itemTotals = menuItems.map((item) => {
    const itemSales = sales.filter(
      (sale) => sale.itemId === item.id
    );

    const totalSold = itemSales.reduce(
      (sum, sale) => sum + sale.quantity,
      0
    );

    return { item, totalSold };
  });

  const sortedItems = itemTotals.sort(
    (a, b) => b.totalSold - a.totalSold
  );

  return sortedItems.slice(0, Math.max(0, topN));
}

export function groupWasteByReason(
  wasteRecords: WasteRecord[]
): Record<WasteReason, WasteRecord[]> {
  const groupedWaste: Record<WasteReason, WasteRecord[]> = {
    Expired: [],
    "Cooking error": [],
    "Customer return": [],
    Damage: [],
    Other: []
  };

  wasteRecords.forEach((record) => {
    groupedWaste[record.reason].push(record);
  });

  return groupedWaste;
}

export function calculateCountryComparison(
  sales: SaleTransaction[],
  locations: Location[],
  menuItems: MenuItem[]
): { Colombia: CountryMetrics; USA: CountryMetrics } {

  const calculateMetrics = (
    country: "Colombia" | "USA"
  ): CountryMetrics => {

    const countryLocations = locations.filter(
      (location) => location.country === country
    );

    const locationIds = countryLocations.map(
      (location) => location.id
    );

    const countrySales = sales.filter(
      (sale) => locationIds.includes(sale.locationId)
    );

    const totalUSD = countrySales.reduce(
      (sum, sale) => sum + sale.totalPrice.USD,
      0
    );

    const totalCOP = countrySales.reduce(
      (sum, sale) => sum + sale.totalPrice.COP,
      0
    );

    const totalLocations = countryLocations.length;

    const averageUSD = totalLocations > 0
      ? totalUSD / totalLocations
      : 0;

    const averageCOP = totalLocations > 0
      ? totalCOP / totalLocations
      : 0;

    return {
      totalLocations,
      totalRevenue: {
        USD: Math.round(totalUSD * 100) / 100,
        COP: Math.round(totalCOP * 100) / 100
      },
      averageRevenuePerLocation: {
        USD: Math.round(averageUSD * 100) / 100,
        COP: Math.round(averageCOP * 100) / 100
      },
      totalSales: countrySales.length
    };
  };

  return {
    Colombia: calculateMetrics("Colombia"),
    USA: calculateMetrics("USA")
  };
}
