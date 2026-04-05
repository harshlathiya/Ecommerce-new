import type { ButtonHTMLAttributes } from "react";

export function Button({
  variant = "default",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "primary" }) {
  const cls =
    variant === "primary" ? "ecom-btn ecom-btn--primary" : "ecom-btn";
  return <button type="button" className={cls} {...props} />;
}
