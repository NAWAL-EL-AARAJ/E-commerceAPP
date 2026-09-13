"use client";

import Link from "next/link";
import { prixFormate } from "../lib/content";
import { useAdmin } from "./_components/AdminProviders";
import { Badge, Card, CardTitle } from "./_components/ui";
import {
  BagIcon,
  ClockIcon,
  CoinIcon,
  TagIcon,
} from "../components/icons";
import {
  classeStatutCommande,
  dateCourte,
  niveauStock,
} from "./_lib/helpers";

export default function DashboardPage() {
  const { produits, commandes, dataLoading } = useAdmin();

  const ca = commandes
    .filter((c) => c.statut !== "annulée")
    .reduce((s, c) => s + (c.total || 0), 0);
  const enAttente = commandes.filter((c) => c.statut === "en attente").length;
  const stockBas = produits.filter((p) => (p.stock ?? 0) <= 5);

  const stats = [
    { label: "Produits", valeur: produits.length, icon: TagIcon },
    { label: "Commandes", valeur: commandes.length, icon: BagIcon },
    { label: "Chiffre d'affaires", valeur: prixFormate(ca), icon: CoinIcon },
    { label: "En attente", valeur: enAttente, icon: ClockIcon },
  ];

  if (dataLoading) {
    return <p className="text-sm text-taupe">Chargement des données…</p>;
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, valeur, icon: Icon }) => (
          <Card key={label} className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-taupe">
                {label}
              </p>
              <p className="mt-2 font-display text-3xl text-espresso">
                {valeur}
              </p>
            </div>
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-cream text-rosewood">
              <Icon width={20} height={20} />
            </span>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Card>
          <div className="flex items-center justify-between">
            <CardTitle>Dernières commandes</CardTitle>
            <Link
              href="/admin/commandes"
              className="text-xs uppercase tracking-[0.12em] text-rosewood hover:underline"
            >
              Tout voir
            </Link>
          </div>
          <div className="mt-4 divide-y divide-line">
            {commandes.slice(0, 6).map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between gap-3 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-espresso">
                    {c.nom_client}
                  </p>
                  <p className="text-xs text-taupe">
                    {dateCourte(c.created_at)} · {prixFormate(c.total)}
                  </p>
                </div>
                <Badge className={classeStatutCommande(c.statut)}>
                  {c.statut}
                </Badge>
              </div>
            ))}
            {commandes.length === 0 && (
              <p className="py-3 text-sm text-taupe">Aucune commande.</p>
            )}
          </div>
        </Card>

        <Card>
          <CardTitle>Stock à surveiller</CardTitle>
          <div className="mt-4 space-y-2">
            {stockBas.map((p) => {
              const n = niveauStock(p.stock);
              return (
                <div
                  key={p.id}
                  className="flex items-center justify-between gap-3 rounded-lg bg-cream px-3 py-2.5"
                >
                  <span className="truncate text-sm text-espresso">
                    {p.nom}
                  </span>
                  <span className="flex shrink-0 items-center gap-2 text-xs text-taupe">
                    {p.stock ?? 0} en stock
                    <Badge className={n.classe}>{n.label}</Badge>
                  </span>
                </div>
              );
            })}
            {stockBas.length === 0 && (
              <p className="text-sm text-taupe">
                Tous les stocks sont confortables ✦
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
