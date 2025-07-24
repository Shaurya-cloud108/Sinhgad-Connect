
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Returns an emoji based on graduation date.
 * 🎓 for alumni (graduated)
 * 🧑‍🎓 for students (not yet graduated)
 * Returns an empty string for invalid dates (e.g., year 0 for system accounts).
 * @param graduationYear The year of graduation.
 * @param graduationMonth The month of graduation (1-12).
 * @returns string
 */
export function getStatusEmoji(graduationYear: number, graduationMonth: number): string {
    if (!graduationYear || !graduationMonth) {
        return ''; // Don't show emoji for system accounts or invalid data
    }

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // getMonth() is 0-indexed

    if (graduationYear < currentYear || (graduationYear === currentYear && graduationMonth < currentMonth)) {
        return '🎓'; // Alumni
    }
    return '🧑‍🎓'; // Student
}
