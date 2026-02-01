import { Leaf } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center justify-center">
            <Leaf className="h-12 w-12 text-primary" />
            <h1 className="mt-2 text-3xl font-bold text-center text-foreground font-headline">
              Evergreen Muse
            </h1>
        </div>
        {children}
      </div>
    </div>
  );
}
