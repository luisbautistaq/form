import { RegisterForm } from "@/components/auth/register-form";
import { Logo } from "@/components/icons/logo";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4">
      <div className="mx-auto w-full max-w-sm">
        <div className="mb-4 flex justify-center">
            <Logo className="h-10 w-10" />
        </div>
        <Card>
            <CardHeader className="text-center">
                <CardTitle className="font-headline text-2xl">Crear una Cuenta</CardTitle>
                <CardDescription>Ingresa tus datos para comenzar</CardDescription>
            </CardHeader>
            <CardContent>
                <RegisterForm />
            </CardContent>
        </Card>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          ¿Ya tienes una cuenta?{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
