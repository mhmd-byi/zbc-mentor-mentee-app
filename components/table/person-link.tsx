import Link from "next/link";

type PersonLinkProps = {
  href: string;
  name: string;
  detail?: string;
};

// A person's name, linking to their page, with a line of detail underneath.
export function PersonLink({ href, name, detail }: PersonLinkProps) {
  return (
    <Link
      href={href}
      className="block rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <span className="block font-semibold text-primary">{name}</span>
      {detail && <span className="block text-muted-foreground">{detail}</span>}
    </Link>
  );
}
