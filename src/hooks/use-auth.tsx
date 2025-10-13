"use client";

import { useUser } from '@/firebase';

// Este gancho ahora es un contenedor más simple alrededor del gancho `useUser` de Firebase.
export const useAuth = () => {
  const { user, isUserLoading, userError } = useUser();
  
  // Mapeamos los nombres de las propiedades para mantener la compatibilidad con el resto de la aplicación.
  return { user, loading: isUserLoading, error: userError };
};
