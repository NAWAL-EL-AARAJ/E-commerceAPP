"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { colors, fontBody, fontDisplay, inputStyle } from "./theme";

export default function LoginCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setErrorMsg("Email ou mot de passe incorrect");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: colors.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "380px",
          background: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: "10px",
          padding: "36px 32px",
        }}
      >
        <p
          style={{
            fontFamily: fontBody,
            fontSize: "13px",
            color: colors.inkMuted,
            margin: "0 0 4px",
          }}
        >
          Espace administration
        </p>
        <h1
          style={{
            fontFamily: fontDisplay,
            fontSize: "30px",
            fontWeight: 600,
            color: colors.ink,
            margin: "0 0 28px",
          }}
        >
          MERHAS
        </h1>
        <form
          onSubmit={handleLogin}
          style={{ display: "flex", flexDirection: "column", gap: "12px" }}
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            required
          />
          <button
            type="submit"
            className="merhas-btn-primary"
            style={{
              padding: "12px",
              background: colors.plum,
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontFamily: fontBody,
              fontWeight: 600,
              fontSize: "14px",
              marginTop: "4px",
              transition: "background 0.15s",
            }}
          >
            Se connecter
          </button>
          {errorMsg && (
            <p
              style={{
                color: colors.rust,
                fontSize: "13px",
                fontFamily: fontBody,
                margin: 0,
              }}
            >
              {errorMsg}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
