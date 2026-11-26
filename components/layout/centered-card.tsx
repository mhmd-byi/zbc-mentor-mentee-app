import type { ReactNode } from "react";
import { Logo } from "@/components/logo";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "./page-header";

type CenteredCardProps = {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
};

// A single focused task on its own screen, such as signing in.
export function CenteredCard({
  title,
  description,
  children,
  footer,
}: CenteredCardProps) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 bg-brand-glow px-4 py-10">
      <Card className="w-full max-w-[27rem] motion-safe:animate-materialize sm:[--card-spacing:--spacing(10)]">
        <CardContent className="flex flex-col gap-8">
          <div className="flex flex-col items-center gap-5 text-center">
            <Logo height={104} />
            <PageHeader title={title} description={description} />
          </div>
          {children}
        </CardContent>
      </Card>
      {footer}
    </main>
  );
}
