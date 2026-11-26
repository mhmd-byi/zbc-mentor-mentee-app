type PageHeaderProps = {
  title: string;
  description?: string;
};

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-2">
      {/* Large text takes tighter tracking and leading than body text. */}
      <h1 className="text-[2rem] leading-[1.125] font-bold tracking-[-0.022em] text-balance">
        {title}
      </h1>
      {description && (
        <p className="text-[1.0625rem] text-pretty text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}
