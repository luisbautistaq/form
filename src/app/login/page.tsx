import { LoginForm } from "@/components/auth/login-form";
import { Logo } from "@/components/icons/logo";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4">
      <div className="mx-auto w-full max-w-sm">
        <div className="mb-4 flex justify-center">
            <Logo className="h-10 w-10" />
        </div>
        <Card>
            <CardHeader className="text-center">
                <CardTitle className="font-headline text-2xl">Inicio de Sesión de Administrador</CardTitle>
                <CardDescription>Ingresa tus credenciales para acceder al panel de control</CardDescription>
            </CardHeader>
            <CardContent>
                <LoginForm />
            </CardContent>
        </Card>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          ¿No tienes una cuenta?{' '}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
