"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";
import type { Commande, Produit } from "../../lib/types";
import { ventesProduit } from "../_lib/helpers";

interface AdminContextValue {
  session: Session | null;
  authLoading: boolean;
  produits: Produit[];
  commandes: Commande[];
  dataLoading: boolean;
  refetchProduits: () => Promise<void>;
  refetchCommandes: () => Promise<void>;
  refreshSession: () => Promise<void>;
  signOut: () => Promise<void>;
  getVentes: (nom: string) => number;
}

const AdminContext = createContext<AdminContextValue | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [produits, setProduits] = useState<Produit[]>([]);
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_e, s) =>
      setSession(s),
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  const refetchProduits = useCallback(async () => {
    const { data } = await supabase
      .from("produits")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setProduits(data as Produit[]);
  }, []);

  const refetchCommandes = useCallback(async () => {
    const { data } = await supabase
      .from("commandes")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setCommandes(data as Commande[]);
  }, []);

  const refreshSession = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    setSession(data.session);
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  useEffect(() => {
    if (!session) {
      setDataLoading(false);
      return;
    }
    setDataLoading(true);
    Promise.all([refetchProduits(), refetchCommandes()]).finally(() =>
      setDataLoading(false),
    );
  }, [session, refetchProduits, refetchCommandes]);

  const getVentes = useCallback(
    (nom: string) => ventesProduit(commandes, nom),
    [commandes],
  );

  return (
    <AdminContext.Provider
      value={{
        session,
        authLoading,
        produits,
        commandes,
        dataLoading,
        refetchProduits,
        refetchCommandes,
        refreshSession,
        signOut,
        getVentes,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin(): AdminContextValue {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin doit être utilisé dans <AdminProvider>");
  return ctx;
}
