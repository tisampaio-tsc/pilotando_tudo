"use client";

import { useState } from "react";
import { Lock } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/20 text-gold mb-4">
            <Lock size={28} />
          </div>
          <h1 className="font-display font-bold text-2xl text-gold">
            Painel Adriana
          </h1>
          <p className="text-white/60 text-sm mt-2">
            Entre para administrar o site
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm text-white/70 mb-1.5">
              Usuário
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3.5 text-base text-white placeholder-white/30 focus:outline-none focus:border-gold min-h-[48px]"
              placeholder="Seu usuário"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm text-white/70 mb-1.5">
              Senha
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3.5 text-base text-white placeholder-white/30 focus:outline-none focus:border-gold min-h-[48px]"
              placeholder="Sua senha"
              required
            />
          </div>

          {error && (
            <p className="text-red-300 text-sm text-center bg-red-500/10 rounded-lg py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gold hover:bg-gold-light text-navy-900 font-bold rounded-xl text-base transition-colors disabled:opacity-50 min-h-[52px]"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
