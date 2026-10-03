import type { ComponentProps } from "react";

import { buttonClasses, type ButtonSize, type ButtonVariant } from "./button-styles";

type ButtonProps = ComponentProps<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({ className, size, type = "button", variant, ...props }: ButtonProps) {
  return <button className={buttonClasses({ variant, size, className })} type={type} {...props} />;
}
