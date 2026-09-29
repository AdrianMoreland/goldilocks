export type ThemeStyleProps = {
  background: string;
  foreground: string;
  card: string;
  "card-foreground": string;
  popover: string;
  "popover-foreground": string;
  primary: string;
  "primary-foreground": string;
  secondary: string;
  "secondary-foreground": string;
  muted: string;
  "muted-foreground": string;
  accent: string;
  "accent-foreground": string;
  destructive: string;
  "destructive-foreground": string;
  border: string;
  input: string;
  ring: string;
  "chart-1": string;
  "chart-2": string;
  "chart-3": string;
  "chart-4": string;
  "chart-5": string;
  sidebar: string;
  "sidebar-foreground": string;
  "sidebar-primary": string;
  "sidebar-primary-foreground": string;
  "sidebar-accent": string;
  "sidebar-accent-foreground": string;
  "sidebar-border": string;
  "sidebar-ring": string;
  "font-sans": string;
  "font-serif": string;
  "font-mono": string;
  radius: string;
  "shadow-color"?: string;
  "shadow-opacity"?: string;
  "shadow-blur"?: string;
  "shadow-spread"?: string;
  "shadow-offset-x"?: string;
  "shadow-offset-y"?: string;
  "letter-spacing"?: string;
  spacing?: string;
  /** Trade-direction colours (see index.css) — optional; a theme that omits them gets the Merrion teal/raspberry. */
  price?: string;
  buyback?: string;
  /** Surface for cards that should stand slightly off the page (spot-price cards). Falls back to a mix of card and foreground. */
  "card-raised"?: string;
  /** Text tones for primary/price/buyback — darker than the fill in light mode where the fill is too light to read on white. Fall back to the fill. */
  "primary-text"?: string;
  "price-text"?: string;
  "buyback-text"?: string;
};

export type ThemeStyles = {
  light: Partial<ThemeStyleProps>;
  dark: Partial<ThemeStyleProps>;
};

export type ThemePreset = {
  source?: "SAVED" | "BUILT_IN";
  createdAt?: string;
  label?: string;
  styles: ThemeStyles;
};
