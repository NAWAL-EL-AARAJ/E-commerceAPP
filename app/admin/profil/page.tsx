"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAdmin } from "../_components/AdminProviders";
import { Button, Card, CardTitle, Feedback, FIELD, Label } from "../_components/ui";

export default function AdminPage() {
  const { session, refreshSession } = useAdmin();
  const email = session?.user?.email ?? "";

  const [nom, setNom] = useState<string>(
    (session?.user?.user_metadata?.nom as string) ?? "",
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function enregistrer(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      data: { nom: nom.trim() },
    });
    setLoading(false);

    if (error) {
      setMessage("Erreur : " + error.message);
      return;
    }
    await refreshSession();
    setMessage("Nom mis à jour.");
  }

  return (
    <div className="max-w-md">
      <Card>
        <CardTitle>Mon compte admin</CardTitle>
        <p className="mt-1 text-sm text-taupe">
          Ce nom s&apos;affiche dans le menu de l&apos;admin.
        </p>
        <form onSubmit={enregistrer} className="mt-5 space-y-4">
          <div>
            <Label>Nom d&apos;utilisateur</Label>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Ex. Maryam"
              className={FIELD}
              required
            />
          </div>
          <div>
            <Label>Email</Label>
            <input type="email" value={email} disabled className={FIELD} />
          </div>
          <div className="flex items-center gap-3">
            <Button type="submit" disabled={loading}>
              {loading ? "Enregistrement…" : "Enregistrer"}
            </Button>
            <Feedback message={message} />
          </div>
        </form>
      </Card>
    </div>
  );
}
