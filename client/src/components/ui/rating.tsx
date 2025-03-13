import { Star, StarHalf } from "lucide-react";

interface RatingProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Rating({ value, max = 5, size = "sm", className = "" }: RatingProps) {
  // Calculate full stars, half stars, and empty stars
  const fullStars = Math.floor(value);
  const hasHalfStar = value % 1 >= 0.5;
  const emptyStars = max - fullStars - (hasHalfStar ? 1 : 0);
  
  // Determine size of stars
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  }[size];

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {/* Render full stars */}
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={`full-${i}`} className={`fill-yellow-400 text-yellow-400 ${sizeClasses}`} />
      ))}
      
      {/* Render half star if needed */}
      {hasHalfStar && (
        <StarHalf className={`fill-yellow-400 text-yellow-400 ${sizeClasses}`} />
      )}
      
      {/* Render empty stars */}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={`empty-${i}`} className={`text-yellow-400 ${sizeClasses}`} />
      ))}
    </div>
  );
}
