import { LoginForm } from "@/components/auth/login-form";
import { Logo } from "@/components/icons/logo";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4">
      <div className="mx-auto w-full max-w-sm">
        <div className="mb-4 flex justify-center">
            <Logo className="h-10 w-10" />
        </div>
        <Card>
            <CardHeader className="text-center">
                <CardTitle className="font-headline text-2xl">Admin Login</CardTitle>
                <CardDescription>Enter your credentials to access the dashboard</CardDescription>
            </CardHeader>
            <CardContent>
                <LoginForm />
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
