
import type { Location, MenuItem } from "../types/models";

export function findLocationById(
  locations: Location[],
  id: string
): Location | null {
  for (const location of locations) {
    if (location.id === id) {
      return location;
    }
  }

  return null;
}

export function findMenuItemByName(
  items: MenuItem[],
  name: string
): MenuItem | null {
  for (const item of items) {
    if (item.name.toLowerCase() === name.toLowerCase()) {
      return item;
    }
  }

  return null;
}

export function binarySearchLocationByCapacity(
  locations: Location[],
  targetCapacity: number
): number {
  let left = 0;
  let right = locations.length - 1;

  while (left <= right) {
    const middle = Math.floor((left + right) / 2);
    const capacity = locations[middle].seatingCapacity;

    if (capacity === targetCapacity) {
      return middle;
    }

    if (capacity < targetCapacity) {
      left = middle + 1;
    } else {
      right = middle - 1;
    }
  }

  return -1;
}

