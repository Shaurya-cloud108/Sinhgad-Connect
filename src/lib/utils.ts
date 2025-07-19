import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Returns an emoji based on graduation year.
 * 🎓 for alumni (graduated)
 * 🧑‍🎓 for students (not yet graduated)
 * @param graduationYear The year of graduation.
 * @returns string
 */
export function getStatusEmoji(graduationYear: number): string {
    const currentYear = new Date().getFullYear();
    if (graduationYear < currentYear) {
        return '🎓'; // Alumni
    }
    return '🧑‍🎓'; // Student
}
