"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAdmin } from "../_components/AdminProviders";
import { Button, Card, CardTitle, Feedback, FIELD, Label } from "../_components/ui";
import { initiales } from "../_lib/helpers";

export default function ProfilPage() {
  const { session, refreshSession } = useAdmin();
  const email = session?.user?.email ?? "";

  const [nom, setNom] = useState<string>(
    (session?.user?.user_metadata?.nom as string) ?? "",
  );
  const [photoUrl, setPhotoUrl] = useState<string>(
    (session?.user?.user_metadata?.avatar_url as string) ?? "",
  );
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [profilLoading, setProfilLoading] = useState(false);
  const [profilMsg, setProfilMsg] = useState("");

  const [mdp, setMdp] = useState("");
  const [confirmMdp, setConfirmMdp] = useState("");
  const [mdpLoading, setMdpLoading] = useState(false);
  const [mdpMsg, setMdpMsg] = useState("");

  async function enregistrerProfil(e: React.FormEvent) {
    e.preventDefault();
    setProfilMsg("");
    setProfilLoading(true);

    let avatarUrl = photoUrl;

    if (photoFile && session) {
      const fileName = `${session.user.id}-${Date.now()}-${photoFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, photoFile, { upsert: true });

      if (uploadError) {
        setProfilMsg("Erreur : " + uploadError.message);
        setProfilLoading(false);
        return;
      }
      avatarUrl = supabase.storage.from("avatars").getPublicUrl(fileName)
        .data.publicUrl;
    }

    const { error } = await supabase.auth.updateUser({
      data: { nom, avatar_url: avatarUrl },
    });
    setProfilLoading(false);

    if (error) {
      setProfilMsg("Erreur : " + error.message);
      return;
    }

    setPhotoUrl(avatarUrl);
    setPhotoFile(null);
    await refreshSession();
    setProfilMsg("Profil mis à jour.");
  }

  async function changerMdp(e: React.FormEvent) {
    e.preventDefault();
    setMdpMsg("");

    if (mdp.length < 6) {
      setMdpMsg("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    if (mdp !== confirmMdp) {
      setMdpMsg("Les deux mots de passe ne correspondent pas.");
      return;
    }

    setMdpLoading(true);
    const { error } = await supabase.auth.updateUser({ password: mdp });
    setMdpLoading(false);

    if (error) {
      setMdpMsg("Erreur : " + error.message);
      return;
    }
    setMdp("");
    setConfirmMdp("");
    setMdpMsg("Mot de passe mis à jour.");
  }

  const apercu = photoFile ? URL.createObjectURL(photoFile) : photoUrl;

  return (
    <div className="grid max-w-xl gap-6">
      <Card>
        <CardTitle>Mon profil</CardTitle>
        <form onSubmit={enregistrerProfil} className="mt-5 space-y-4">
          <div className="flex items-center gap-4">
            {apercu ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={apercu}
                alt=""
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <span className="grid h-16 w-16 place-items-center rounded-full bg-cream text-lg font-medium text-rosewood">
                {initiales(nom, email)}
              </span>
            )}
            <div className="flex-1">
              <Label>Photo de profil</Label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
                className="block w-full text-sm text-taupe file:mr-3 file:rounded-lg file:border file:border-line file:bg-white file:px-3 file:py-2 file:text-sm file:text-espresso hover:file:bg-cream"
              />
            </div>
          </div>

          <div>
            <Label>Nom affiché</Label>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className={FIELD}
              placeholder="Ton nom"
            />
          </div>

          <div>
            <Label>Email</Label>
            <input type="email" value={email} disabled className={FIELD} />
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={profilLoading}>
              {profilLoading ? "Enregistrement…" : "Enregistrer"}
            </Button>
            <Feedback message={profilMsg} />
          </div>
        </form>
      </Card>

      <Card>
        <CardTitle>Changer le mot de passe</CardTitle>
        <form onSubmit={changerMdp} className="mt-5 space-y-4">
          <div>
            <Label>Nouveau mot de passe</Label>
            <input
              type="password"
              value={mdp}
              onChange={(e) => setMdp(e.target.value)}
              className={FIELD}
              placeholder="Au moins 6 caractères"
            />
          </div>
          <div>
            <Label>Confirmer le mot de passe</Label>
            <input
              type="password"
              value={confirmMdp}
              onChange={(e) => setConfirmMdp(e.target.value)}
              className={FIELD}
              placeholder="Retape le mot de passe"
            />
          </div>
          <div className="flex items-center gap-3">
            <Button type="submit" variant="secondary" disabled={mdpLoading}>
              {mdpLoading ? "Mise à jour…" : "Mettre à jour"}
            </Button>
            <Feedback message={mdpMsg} />
          </div>
        </form>
      </Card>
    </div>
  );
}
