"use client";
import { doSignOut } from "@/lib/firebase/auth";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

export default function FeedPage() {
  const { user } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await doSignOut();
    router.push("/signup");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="space-y-4 text-center">
        <h1 className="text-3xl font-bold">Welcome!</h1>
        <p className="text-muted-foreground">You are logged in as: {user?.email}</p>
        <Button onClick={handleSignOut}>Sign Out</Button>
      </div>
    </div>
  );
}
