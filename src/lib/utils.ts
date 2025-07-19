import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Returns an emoji based on graduation date.
 * 🎓 for alumni (graduated)
 * 🧑‍🎓 for students (not yet graduated)
 * @param graduationYear The year of graduation.
 * @param graduationMonth The month of graduation (1-12).
 * @returns string
 */
export function getStatusEmoji(graduationYear: number, graduationMonth: number): string {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // getMonth() is 0-indexed

    if (graduationYear < currentYear || (graduationYear === currentYear && graduationMonth < currentMonth)) {
        return '🎓'; // Alumni
    }
    return '🧑‍🎓'; // Student
}
