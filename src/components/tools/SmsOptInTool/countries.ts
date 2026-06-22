export interface Country {
  code: string; // ISO
  name: string;
  dial: string; // e.g. "1"
  flag: string;
}

export const COUNTRIES: Country[] = [
  { code: "US", name: "United States", dial: "1", flag: "🇺🇸" },
  { code: "CA", name: "Canada", dial: "1", flag: "🇨🇦" },
  { code: "GB", name: "United Kingdom", dial: "44", flag: "🇬🇧" },
  { code: "AU", name: "Australia", dial: "61", flag: "🇦🇺" },
  { code: "NZ", name: "New Zealand", dial: "64", flag: "🇳🇿" },
  { code: "IE", name: "Ireland", dial: "353", flag: "🇮🇪" },
  { code: "DE", name: "Germany", dial: "49", flag: "🇩🇪" },
  { code: "FR", name: "France", dial: "33", flag: "🇫🇷" },
  { code: "ES", name: "Spain", dial: "34", flag: "🇪🇸" },
  { code: "IT", name: "Italy", dial: "39", flag: "🇮🇹" },
  { code: "NL", name: "Netherlands", dial: "31", flag: "🇳🇱" },
  { code: "MX", name: "Mexico", dial: "52", flag: "🇲🇽" },
  { code: "BR", name: "Brazil", dial: "55", flag: "🇧🇷" },
];

export const DEFAULT_COUNTRY = COUNTRIES[0];
