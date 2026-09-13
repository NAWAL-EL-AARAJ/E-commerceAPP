"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import Logo from "../../components/ui/Logo";
import { Button, FIELD } from "./ui";

export default function LoginCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erreur, setErreur] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErreur("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) setErreur("Email ou mot de passe incorrect.");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-cream px-4">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-white p-8">
        <div className="flex flex-col items-center text-center">
          <Logo size={68} priority />
          <p className="mt-4 text-xs uppercase tracking-[0.22em] text-taupe">
            Espace administration
          </p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={FIELD}
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={FIELD}
            required
          />
          <Button type="submit" disabled={loading} className="mt-1 w-full">
            {loading ? "Connexion…" : "Se connecter"}
          </Button>
          {erreur && <p className="text-sm text-rosewood">{erreur}</p>}
        </form>
      </div>
    </main>
  );
}
