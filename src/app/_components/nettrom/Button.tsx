import { twMerge } from "tailwind-merge";
import { ButtonProps, Button as ShadcnButton } from "../shadcn/button";

export const Button = (
  props: ButtonProps & {
    icon?: React.ReactNode;
  },
) => {
  return (
    <ShadcnButton
      {...props}
      className={twMerge(
        "flex h-auto items-center gap-4 bg-web-title px-4 py-3 text-[14px] text-primary-foreground text-white hover:bg-web-titleLighter",
        props.variant === "outline" &&
          "border border-web-title bg-transparent text-web-title hover:bg-web-titleLighter/10 hover:text-web-title",
        props.variant === "ghost" &&
          "bg-transparent hover:bg-transparent hover:text-web-title",
        props.className,
      )}
    >
      {props.icon && <span className="shrink-0">{props.icon}</span>}
      {props.children}
    </ShadcnButton>
  );
};
