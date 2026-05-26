import { cn } from "@/lib/cn";

const LOGO_URL =
  "https://assets.cdn.filesafe.space/srjD6kS5EFIUXLtgl6hd/media/69c6e9f60c63d54fc34025ac.png";

export function Logo({
  variant = "light",
  className,
}: {
  variant?: "light" | "dark";
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={LOGO_URL}
      alt="Heat Suite"
      className={cn(
        "h-8 w-auto object-contain",
        // On dark backgrounds (sidebar, gradient panels) render the logo white.
        variant === "light" && "brightness-0 invert",
        className,
      )}
    />
  );
}
