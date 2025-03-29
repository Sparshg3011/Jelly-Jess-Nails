import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD' 
  }).format(amount / 100);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

// Group gallery items by category
export function groupByCategory<T>(items: T[], categoryKey: keyof T): Record<string, T[]> {
  return items.reduce((groups, item) => {
    const category = String(item[categoryKey]);
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

// Get unique categories from array of items
export function getUniqueCategories<T>(items: T[], categoryKey: keyof T): string[] {
  const categories = new Set(items.map(item => String(item[categoryKey])));
  return Array.from(categories);
}

/**
 * Smoothly scrolls to a section on the page by its ID
 * @param elementId The ID of the section to scroll to (without the # symbol)
 */
export function scrollToSection(elementId: string) {
  // Remove the # if it's included
  const id = elementId.startsWith('#') ? elementId.substring(1) : elementId;
  
  const element = document.getElementById(id);
  if (element) {
    // Use smooth scrolling behavior
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}
