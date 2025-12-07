"use client";

import { signIn, signOut } from "next-auth/react";
import { Session } from "next-auth";
import Image from "next/image";
import PlacesAutocomplete from "../Search/PlacesAutocomplete";

interface HeaderProps {
  session: Session | null;
}

export default function Header({ session }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🍺</span>
          <h1 className="text-xl font-bold text-gray-900 hidden md:block">MadridBarMap</h1>
        </div>

        <div className="flex-1 max-w-xl mx-4">
          <PlacesAutocomplete />
        </div>

        <div className="flex items-center gap-4">
          {session?.user ? (
            <div className="flex items-center gap-3">
              {session.user.image && (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "Usuario"}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              )}
              <span className="text-sm text-gray-700 hidden sm:inline">
                {session.user.name}
              </span>
              <button
                onClick={() => signOut()}
                className="text-sm text-gray-600 hover:text-gray-900 underline"
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Iniciar sesión con Google
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
