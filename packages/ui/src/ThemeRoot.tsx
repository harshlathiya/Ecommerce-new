import type { CSSProperties, ReactNode } from "react";

export function ThemeRoot({
  primary,
  secondary,
  children,
}: {
  primary?: string;
  secondary?: string;
  children: ReactNode;
}) {
  const style = {
    "--ecom-primary": primary,
    "--ecom-secondary": secondary,
  } as CSSProperties;
  return (
    <div style={style} className="ecom-theme-root">
      {children}
    </div>
  );
}
