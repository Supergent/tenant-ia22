import type { Config } from "tailwindcss";
import { tailwindPreset } from "@jn7ed9ecyrkk0hy21eehbbj6bx7sk268/design-tokens/tailwind.preset";

const config: Config = {
  darkMode: ["class"],
  presets: [tailwindPreset],
  content: ["./src/**/*.{{ts,tsx}}"],
  plugins: [],
};

export default config;
