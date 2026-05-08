export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const classes = { sm: "spinner-sm", md: "spinner", lg: "spinner-lg" };
  return <div className={classes[size]} />;
}

export function LoadingPage() {
  return (
    <div className="loading-overlay">
      <div className="flex flex-col items-center gap-3">
        <div className="spinner-lg" />
        <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>
      </div>
    </div>
  );
}
