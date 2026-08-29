"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import StitchDivider from "./StitchDivider";

interface LoginFormProps {
  onLogin: (username: string, password: string) => Promise<void>;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await onLogin(username.trim().toLowerCase(), password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao entrar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-panel-bg">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-denim-light text-denim mb-4">
            <Lock size={28} />
          </div>
          <h1 className="font-display font-bold text-2xl text-denim-dark">
            Painel Adriana
          </h1>
          <StitchDivider className="mx-auto mt-3 mb-2" />
          <p className="text-panel-muted text-sm mt-2">
            Entre para administrar o site
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="relative space-y-4 bg-panel-surface border-2 border-dashed border-stitch/60 rounded-2xl p-6 shadow-sm"
        >
          <span
            className="jeans-rivet jeans-rivet-sm absolute -top-1.5 -left-1.5"
            aria-hidden
          />
          <span
            className="jeans-rivet jeans-rivet-sm absolute -top-1.5 -right-1.5"
            aria-hidden
          />
          <div>
            <label htmlFor="username" className="block text-sm text-panel-muted mb-1.5">
              Usuário
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-panel-bg border border-panel-border rounded-xl px-4 py-3.5 text-base text-panel-ink placeholder-panel-muted/60 focus:outline-none focus:border-denim focus:ring-2 focus:ring-denim/20 min-h-[48px]"
              placeholder="Seu usuário"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm text-panel-muted mb-1.5">
              Senha
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-panel-bg border border-panel-border rounded-xl px-4 py-3.5 text-base text-panel-ink placeholder-panel-muted/60 focus:outline-none focus:border-denim focus:ring-2 focus:ring-denim/20 min-h-[48px]"
              placeholder="Sua senha"
              required
            />
          </div>

          {error && (
            <p className="text-panel-danger text-sm text-center bg-panel-danger-bg rounded-lg py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-fabric w-full py-4 bg-denim hover:bg-denim-dark text-white font-bold rounded-xl text-base transition-colors disabled:opacity-50 min-h-[52px]"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
