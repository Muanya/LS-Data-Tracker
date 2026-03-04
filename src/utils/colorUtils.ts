/**
 * Creates a gradient from a hex color
 * @param hexColor - Base hex color (e.g., "#8B5CF6")
 * @returns Gradient class string for Tailwind
 */
export const createGradientFromColor = (hexColor: string): string => {
  // Map common colors to predefined Tailwind gradients for better visual consistency
  const colorMap: Record<string, string> = {
    '#8B5CF6': 'from-purple-500 to-purple-600',
    '#3B82F6': 'from-blue-500 to-blue-600',
    '#10B981': 'from-emerald-500 to-emerald-600',
    '#F59E0B': 'from-amber-500 to-amber-600',
    '#EF4444': 'from-red-500 to-red-600',
    '#6366F1': 'from-indigo-500 to-indigo-600',
    '#8B5A2B': 'from-rose-500 to-rose-600',
    '#059669': 'from-teal-500 to-teal-600',
    '#DC2626': 'from-red-600 to-red-700',
    '#7C3AED': 'from-violet-500 to-violet-600',
    '#EC4899': 'from-pink-500 to-pink-600',
    '#14B8A6': 'from-cyan-500 to-cyan-600',
  };

  const normalized = hexColor.toUpperCase();

  if (colorMap[normalized]) {
    return colorMap[normalized];
  }

  return generateGradientFromHex(hexColor);
};

/**
 * Generates a gradient from any hex color by creating a darker shade.
 * NOTE: Arbitrary Tailwind values (e.g. from-[#hex]) require Tailwind JIT (v3+)
 * and the classes must be statically detectable or safelisted.
 * If building class names at runtime, consider using inline styles instead.
 * @param hexColor - Base hex color (with or without leading #)
 * @returns Gradient class string using Tailwind arbitrary values
 */
const generateGradientFromHex = (hexColor: string): string => {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  // Create darker shade (20% darker)
  const darkerR = Math.max(0, Math.round(r * 0.8)).toString(16).padStart(2, '0');
  const darkerG = Math.max(0, Math.round(g * 0.8)).toString(16).padStart(2, '0');
  const darkerB = Math.max(0, Math.round(b * 0.8)).toString(16).padStart(2, '0');

  const base = hexColor.startsWith('#') ? hexColor : `#${hexColor}`;
  const darkerHex = `#${darkerR}${darkerG}${darkerB}`;
  // Use inline style format that can be applied via style prop using getGradientStyle
  return `from-[${base}] to-[${darkerHex}]`;
};

/**
 * Gets a lighter shade of the color for backgrounds.
 * Blends the color toward white by the given factor (0–1).
 * @param hexColor - Base hex color
 * @param factor - How far to blend toward white (default 0.9 = 90% white)
 * @returns Lighter hex color string
 */
export const getLighterShade = (hexColor: string, factor = 0.9): string => {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  // Blend each channel toward 255 (white) by the given factor
  const lighterR = Math.round(r + (255 - r) * factor).toString(16).padStart(2, '0');
  const lighterG = Math.round(g + (255 - g) * factor).toString(16).padStart(2, '0');
  const lighterB = Math.round(b + (255 - b) * factor).toString(16).padStart(2, '0');

  return `#${lighterR}${lighterG}${lighterB}`;
};

/**
 * Returns inline style objects for dynamic gradients, safe for runtime use
 * when Tailwind JIT cannot statically detect arbitrary class names.
 * @param hexColor - Base hex color
 * @returns React CSSProperties object with gradient background
 */
export const getGradientStyle = (hexColor: string): React.CSSProperties => {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  const darkerR = Math.max(0, Math.round(r * 0.8));
  const darkerG = Math.max(0, Math.round(g * 0.8));
  const darkerB = Math.max(0, Math.round(b * 0.8));

  const base = hexColor.startsWith('#') ? hexColor : `#${hexColor}`;
  const darker = `rgb(${darkerR}, ${darkerG}, ${darkerB})`;

  return {
    background: `linear-gradient(to bottom, ${base}, ${darker})`,
  };
};