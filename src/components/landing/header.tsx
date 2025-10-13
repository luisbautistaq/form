import Link from "next/link";
import { Logo } from "@/components/icons/logo";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo className="h-6 w-6" />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
            <Button asChild variant="ghost" size="sm">
                <Link href="/login">
                    <User className="mr-2" />
                    Admin Login
                </Link>
            </Button>
        </div>
      </div>
    </header>
  );
}
