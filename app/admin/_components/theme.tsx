import type { CSSProperties } from "react";

/** Palette admin alignée sur la charte MERHAS. */
export const colors = {
  bg: "#F7F1E9",
  surface: "#FFFFFF",
  ink: "#3B302B",
  inkMuted: "#8B7A6E",
  border: "#E4D6C6",
  plum: "#A25E56",
  plumDark: "#8A4A43",
  plumTint: "#F1E4E0",
  gold: "#B08D57",
  goldTint: "#F6EFE2",
  sage: "#5B7A55",
  sageBg: "#E9F0E4",
  amber: "#96650C",
  amberBg: "#FBF0DA",
  rust: "#9A3B32",
  rustBg: "#F7E7E4",
} as const;

export const fontDisplay =
  "var(--font-cormorant), Georgia, 'Times New Roman', serif";
export const fontBody =
  "var(--font-jost), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

export const inputStyle: CSSProperties = {
  padding: "11px 12px",
  border: `1px solid ${colors.border}`,
  borderRadius: "6px",
  fontFamily: fontBody,
  fontSize: "14px",
  color: colors.ink,
  background: colors.surface,
};

/** Styles globaux admin (focus, hover) — injectés une fois. */
export function AdminGlobalStyle() {
  return (
    <style>{`
      .merhas-admin input:focus,
      .merhas-admin textarea:focus,
      .merhas-admin select:focus {
        outline: none;
        border-color: ${colors.plum} !important;
        box-shadow: 0 0 0 3px ${colors.plumTint};
      }
      .merhas-btn-primary:hover { background: ${colors.plumDark} !important; }
      .merhas-btn-secondary:hover { background: ${colors.border} !important; }
      .merhas-tab:hover { color: ${colors.ink} !important; }
      .merhas-row:hover { background: ${colors.bg}; }
    `}</style>
  );
}
