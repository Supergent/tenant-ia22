/**
 * CSS Variables Generator
 *
 * Generates CSS custom properties from theme tokens
 */

import { theme } from "./theme";

export function generateCSSVariables(): string {
  return `
:root {
  /* Colors - Primary */
  --primary: ${theme.palette.primary.base};
  --primary-foreground: ${theme.palette.primary.foreground};
  --primary-emphasis: ${theme.palette.primary.emphasis};

  /* Colors - Secondary */
  --secondary: ${theme.palette.secondary.base};
  --secondary-foreground: ${theme.palette.secondary.foreground};
  --secondary-emphasis: ${theme.palette.secondary.emphasis};

  /* Colors - Accent */
  --accent: ${theme.palette.accent.base};
  --accent-foreground: ${theme.palette.accent.foreground};
  --accent-emphasis: ${theme.palette.accent.emphasis};

  /* Colors - Status */
  --success: ${theme.palette.success.base};
  --success-foreground: ${theme.palette.success.foreground};
  --warning: ${theme.palette.warning.base};
  --warning-foreground: ${theme.palette.warning.foreground};
  --danger: ${theme.palette.danger.base};
  --danger-foreground: ${theme.palette.danger.foreground};

  /* Neutrals */
  --background: ${theme.neutrals.background};
  --surface: ${theme.neutrals.surface};
  --muted: ${theme.neutrals.muted};
  --text-primary: ${theme.neutrals.textPrimary};
  --text-secondary: ${theme.neutrals.textSecondary};

  /* Border Radius */
  --radius-sm: ${theme.radius.sm}px;
  --radius-md: ${theme.radius.md}px;
  --radius-lg: ${theme.radius.lg}px;
  --radius-pill: ${theme.radius.pill}px;

  /* Shadows */
  --shadow-sm: ${theme.shadows.sm};
  --shadow-md: ${theme.shadows.md};
  --shadow-lg: ${theme.shadows.lg};

  /* Motion */
  --motion-ease: ${theme.motion.ease};
  --motion-fast: ${theme.motion.duration.fast}ms;
  --motion-base: ${theme.motion.duration.base}ms;
  --motion-slow: ${theme.motion.duration.slow}ms;
}
`.trim();
}
