import type { Config } from "tailwindcss";
import tailwindcssanimate from "tailwindcss-animate";
import typography from "@tailwindcss/typography";
import { PluginAPI } from "tailwindcss/types/config";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      typography: (theme: PluginAPI["theme"]) => ({
        DEFAULT: {
          css: {
            "code::before": {
              content: '""',
            },
            "code::after": {
              content: '""',
            },
            "--tw-prose-body": theme("colors.gray.700"),
            "--tw-prose-headings": theme("colors.gray.900"),
            "--tw-prose-links": theme("colors.purple.600"),
            "--tw-prose-bold": theme("colors.gray.900"),
            "--tw-prose-code": theme("colors.purple.600"),
            "--tw-prose-quotes": theme("colors.gray.900"),
            "--tw-prose-pre-code": theme("colors.gray.200"),
            "--tw-prose-pre-bg": theme("colors.gray.800"),
            "--tw-prose-th-borders": theme("colors.gray.200"),
            "--tw-prose-td-borders": theme("colors.gray.100"),
            "--tw-prose-invert-body": theme("colors.gray.300"),
            "--tw-prose-invert-headings": theme("colors.white"),
            "--tw-prose-invert-links": theme("colors.purple.400"),
            "--tw-prose-invert-bold": theme("colors.white"),
            "--tw-prose-invert-code": theme("colors.purple.400"),
            "--tw-prose-invert-pre-code": theme("colors.gray.300"),
            "--tw-prose-invert-pre-bg": "rgb(0 0 0 / 50%)",
            "--tw-prose-invert-th-borders": theme("colors.gray.700"),
            "--tw-prose-invert-td-borders": theme("colors.gray.800"),
            maxWidth: "none",
          },
        },
      }),
    },
  },
  plugins: [tailwindcssanimate, typography],
} satisfies Config;
