import Image from "next/image";

// public/zbc-logo.png is 896 × 574 and a single dark blue, so it turns white in dark mode.
export function Logo({ height }: { height: number }) {
  return (
    <Image
      src="/zbc-logo.png"
      alt="Indore Jamiyat"
      width={Math.round((height * 896) / 574)}
      height={height}
      preload
      className="dark:brightness-0 dark:invert"
    />
  );
}
