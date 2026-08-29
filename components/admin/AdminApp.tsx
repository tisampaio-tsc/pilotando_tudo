"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  LayoutGrid,
  Palette,
  Share2,
  Rocket,
  Settings,
  LogOut,
  Eye,
  ChevronUp,
  ChevronDown,
  Plus,
  Trash2,
  Wifi,
  WifiOff,
  Download,
} from "lucide-react";
import type { SiteContent, SiteSection } from "@/lib/content-schema";
import { SECTION_LABELS, createId } from "@/lib/content-schema";
import { getThemeOption, normalizeTheme } from "@/lib/theme";
import {
  checkAuth,
  login,
  logout,
  fetchDraft,
  saveDraft,
  publishContent,
  fetchVersions,
  restoreVersion,
  fetchDeployStatus,
  markDeployComplete,
  changePassword,
  saveOfflineDraft,
  loadOfflineDraft,
  clearOfflineDraft,
} from "@/lib/admin-api";
import SectionRenderer from "@/components/SectionRenderer";
import Footer from "@/components/Footer";
import LoginForm from "./LoginForm";
import Field from "./Field";
import ThemePicker from "./ThemePicker";
import ShareTab from "./ShareTab";
import StitchDivider from "./StitchDivider";

type Tab = "content" | "aparencia" | "share" | "publish" | "settings";
type PreviewMode = "section" | "site" | null;

const INSTALL_DISMISSED_KEY = "admin-install-dismissed";

/** Safari no iPhone expõe o modo instalado fora do padrão. */
type NavigatorStandalone = Navigator & { standalone?: boolean };

/** Rascunhos antigos podem não ter o campo de tema. */
function withTheme(content: SiteContent): SiteContent {
  return { ...content, tema: normalizeTheme(content.tema) };
}

export default function AdminApp() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [username, setUsername] = useState("");
  const [tab, setTab] = useState<Tab>("content");
  const [content, setContent] = useState<SiteContent | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [preview, setPreview] = useState<PreviewMode>(null);
  const [online, setOnline] = useState(true);
  const [versions, setVersions] = useState<
    { id: number; published_at: string; label: string | null }[]
  >([]);
  const [deployStatus, setDeployStatus] = useState("");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIosInstall, setShowIosInstall] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [installDismissed, setInstallDismissed] = useState(false);

  const loadContent = useCallback(async () => {
    try {
      const data = await fetchDraft();
      setContent(withTheme(data.draft));
      setHasChanges(data.hasUnpublishedChanges);
      clearOfflineDraft();
    } catch {
      const offline = loadOfflineDraft();
      if (offline) {
        setContent(withTheme(offline));
        setHasChanges(true);
        setMessage("Modo offline — alterações salvas localmente");
      }
    }
  }, []);

  useEffect(() => {
    checkAuth().then((auth) => {
      setAuthenticated(auth.authenticated);
      if (auth.username) setUsername(auth.username);
    });

    setOnline(navigator.onLine);
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    const onBIP = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onBIP);

    const onInstalled = () => {
      setInstalled(true);
      setDeferredPrompt(null);
      setShowIosInstall(false);
    };
    window.addEventListener("appinstalled", onInstalled);

    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as NavigatorStandalone).standalone === true;
    setInstalled(standalone);
    if (isIos && !standalone) setShowIosInstall(true);
    if (localStorage.getItem(INSTALL_DISMISSED_KEY) === "1") {
      setInstallDismissed(true);
    }

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("beforeinstallprompt", onBIP);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  useEffect(() => {
    if (authenticated) {
      loadContent();
      fetchVersions().then((d) => setVersions(d.versions)).catch(() => {});
    }
  }, [authenticated, loadContent]);

  const updateContent = useCallback(
    (updater: (prev: SiteContent) => SiteContent) => {
      setContent((prev) => {
        if (!prev) return prev;
        const next = updater(prev);
        saveOfflineDraft(next);
        setHasChanges(true);

        if (saveTimer.current) clearTimeout(saveTimer.current);
        saveTimer.current = setTimeout(async () => {
          if (!navigator.onLine) return;
          setSaving(true);
          try {
            await saveDraft(next);
            setMessage("Rascunho salvo");
            setError("");
          } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao salvar");
          } finally {
            setSaving(false);
          }
        }, 2000);

        return next;
      });
    },
    []
  );

  const handleLogin = async (user: string, pass: string) => {
    await login(user, pass);
    setAuthenticated(true);
    setUsername(user);
    await loadContent();
  };

  const handleLogout = async () => {
    await logout();
    setAuthenticated(false);
    setContent(null);
  };

  const handlePublish = async () => {
    if (!content) return;
    setPublishing(true);
    setError("");
    try {
      if (navigator.onLine) {
        await saveDraft(content);
      }
      const result = await publishContent(content);
      setHasChanges(false);
      setMessage(result.message);
      clearOfflineDraft();
      const vs = await fetchVersions();
      setVersions(vs.versions);
      pollDeployStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao publicar");
    } finally {
      setPublishing(false);
    }
  };

  const pollDeployStatus = () => {
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      try {
        const status = await fetchDeployStatus();
        setDeployStatus(status.message ?? status.status);
        if (status.status === "success" || attempts > 30) {
          clearInterval(interval);
          if (status.status !== "success") {
            await markDeployComplete();
          }
        }
      } catch {
        if (attempts > 5) clearInterval(interval);
      }
    }, 5000);
  };

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    if (choice.outcome === "accepted") setInstalled(true);
  };

  const dismissInstall = () => {
    setInstallDismissed(true);
    localStorage.setItem(INSTALL_DISMISSED_KEY, "1");
  };

  const canInstall = !installed && (deferredPrompt !== null || showIosInstall);

  const moveSection = (index: number, direction: -1 | 1) => {
    updateContent((prev) => {
      const secoes = [...prev.secoes];
      const target = index + direction;
      if (target < 0 || target >= secoes.length) return prev;
      [secoes[index], secoes[target]] = [secoes[target], secoes[index]];
      return { ...prev, secoes };
    });
  };

  const toggleSection = (id: string) => {
    updateContent((prev) => ({
      ...prev,
      secoes: prev.secoes.map((s) =>
        s.id === id ? { ...s, visible: !s.visible } : s
      ),
    }));
  };

  const editingSection = content?.secoes.find((s) => s.id === editingSectionId);

  if (authenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-panel-bg">
        <div className="text-denim animate-pulse">Verificando...</div>
      </div>
    );
  }

  if (!authenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-panel-bg">
        <div className="text-denim animate-pulse">Carregando conteúdo...</div>
      </div>
    );
  }

  if (preview) {
    const previewSections =
      preview === "site"
        ? content.secoes.filter((s) => s.visible)
        : [
            editingSection ??
              content.secoes.find((s) => s.visible) ??
              content.secoes[0],
          ].filter(Boolean);

    return (
      <div className="min-h-screen bg-white">
        <div className="sticky top-0 z-50 bg-denim-dark text-white px-4 py-3 flex items-center justify-between safe-top">
          <span className="font-semibold text-sm">
            {preview === "site"
              ? `Prévia do site — ${getThemeOption(content.tema).name}`
              : "Pré-visualização"}
          </span>
          <button
            type="button"
            onClick={() => setPreview(null)}
            className="px-4 py-2 bg-white text-denim-dark rounded-lg text-sm font-semibold"
          >
            Voltar ao painel
          </button>
        </div>
        <div data-theme={content.tema} className="pointer-events-none">
          {previewSections.map((section) => (
            <SectionRenderer
              key={section.id}
              section={section}
              contatos={content.contatos}
            />
          ))}
          {preview === "site" && (
            <Footer footer={content.footer} contatos={content.contatos} />
          )}
        </div>
      </div>
    );
  }

  if (editingSection) {
    return (
      <SectionEditor
        section={editingSection}
        onBack={() => setEditingSectionId(null)}
        onPreview={() => setPreview("section")}
        onChange={(updated) =>
          updateContent((prev) => ({
            ...prev,
            secoes: prev.secoes.map((s) =>
              s.id === updated.id ? updated : s
            ),
          }))
        }
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col pb-24 bg-panel-bg">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-panel-surface/95 backdrop-blur border-b border-panel-border px-4 py-3 safe-top">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div>
            <h1 className="font-display font-bold text-denim-dark text-lg">
              Painel Adriana
            </h1>
            <p className="text-panel-muted text-xs">
              Olá, {username}
              {saving && " · salvando..."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {online ? (
              <Wifi size={16} className="text-panel-success" />
            ) : (
              <WifiOff size={16} className="text-panel-warning" />
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="p-2 text-panel-muted hover:text-panel-ink"
              aria-label="Sair"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
        {hasChanges && (
          <div className="mt-2 max-w-4xl mx-auto bg-panel-warning-bg text-panel-warning text-xs px-3 py-1.5 rounded-lg text-center">
            Você tem alterações não publicadas
          </div>
        )}
        {message && (
          <div className="mt-2 max-w-4xl mx-auto bg-panel-success-bg text-panel-success text-xs px-3 py-1.5 rounded-lg text-center">
            {message}
          </div>
        )}
        {error && (
          <div className="mt-2 max-w-4xl mx-auto bg-panel-danger-bg text-panel-danger text-xs px-3 py-1.5 rounded-lg text-center">
            {error}
          </div>
        )}
      </header>

      <main className="flex-1 px-4 py-6 max-w-4xl mx-auto w-full">
        {canInstall && !installDismissed && (
          <div className="mb-6 bg-denim-light border border-denim/30 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Download size={24} className="text-denim-dark shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-panel-ink">Deixe o painel na tela do celular</p>
                <p className="text-panel-muted text-sm mt-0.5">
                  {deferredPrompt
                    ? "Assim você abre direto, como um aplicativo, sem precisar digitar o endereço."
                    : "No iPhone: toque em Compartilhar e depois em Adicionar à Tela de Início."}
                </p>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              {deferredPrompt && (
                <button
                  type="button"
                  onClick={handleInstall}
                  className="flex-1 py-3 bg-denim hover:bg-denim-dark text-white font-bold rounded-lg min-h-[44px] transition-colors"
                >
                  Instalar agora
                </button>
              )}
              <button
                type="button"
                onClick={dismissInstall}
                className="flex-1 py-3 bg-panel-surface border border-panel-border hover:bg-panel-bg rounded-lg font-semibold text-panel-ink min-h-[44px] transition-colors"
              >
                Agora não
              </button>
            </div>
          </div>
        )}
        {tab === "content" && (
          <ContentTab
            content={content}
            onEdit={setEditingSectionId}
            onMove={moveSection}
            onToggle={toggleSection}
            onEditGlobal={(key, value) =>
              updateContent((prev) => ({ ...prev, [key]: value }))
            }
          />
        )}
        {tab === "aparencia" && (
          <ThemePicker
            value={content.tema}
            onChange={(tema) => {
              updateContent((prev) => ({ ...prev, tema }));
              setMessage("Cor escolhida! Vá em Publicar para o site mudar.");
            }}
            onPreview={() => setPreview("site")}
          />
        )}
        {tab === "share" && <ShareTab content={content} />}
        {tab === "publish" && (
          <PublishTab
            hasChanges={hasChanges}
            publishing={publishing}
            deployStatus={deployStatus}
            versions={versions}
            onPublish={handlePublish}
            onRestore={async (id) => {
              const result = await restoreVersion(id);
              setContent(withTheme(result.draft));
              setHasChanges(true);
              setMessage("Versão restaurada como rascunho");
            }}
          />
        )}
        {tab === "settings" && (
          <SettingsTab
            onChangePassword={changePassword}
            deferredPrompt={deferredPrompt}
            showIosInstall={showIosInstall}
            installed={installed}
            onInstall={handleInstall}
          />
        )}
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-panel-surface border-t border-panel-border safe-bottom z-50">
        <div className="flex max-w-4xl mx-auto">
          {(
            [
              { id: "content", icon: LayoutGrid, label: "Conteúdo" },
              { id: "aparencia", icon: Palette, label: "Cores" },
              { id: "share", icon: Share2, label: "Divulgar" },
              { id: "publish", icon: Rocket, label: "Publicar" },
              { id: "settings", icon: Settings, label: "Ajustes" },
            ] as const
          ).map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`relative flex-1 flex flex-col items-center py-3 gap-1 text-[11px] leading-tight transition-colors ${
                tab === id ? "text-denim-dark" : "text-panel-muted"
              }`}
            >
              {tab === id && (
                <span className="jeans-rivet absolute top-1" aria-hidden />
              )}
              <Icon size={22} />
              {label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

/* ---- Sub-components ---- */

function ContentTab({
  content,
  onEdit,
  onMove,
  onToggle,
  onEditGlobal,
}: {
  content: SiteContent;
  onEdit: (id: string) => void;
  onMove: (index: number, dir: -1 | 1) => void;
  onToggle: (id: string) => void;
  onEditGlobal: (key: "site" | "contatos" | "header" | "footer" | "politica", value: unknown) => void;
}) {
  const [globalEdit, setGlobalEdit] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-semibold text-xl mb-1 text-panel-ink">Seções da página</h2>
        <StitchDivider className="ml-0 mr-auto mb-4" />
        <div className="space-y-3">
          {content.secoes.map((section, index) => (
            <div
              key={section.id}
              className="bg-panel-surface border border-panel-border rounded-xl p-4 flex items-center gap-3 shadow-sm"
            >
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => onMove(index, -1)}
                  disabled={index === 0}
                  className="p-1 text-panel-muted disabled:opacity-20"
                  aria-label="Mover para cima"
                >
                  <ChevronUp size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => onMove(index, 1)}
                  disabled={index === content.secoes.length - 1}
                  className="p-1 text-panel-muted disabled:opacity-20"
                  aria-label="Mover para baixo"
                >
                  <ChevronDown size={18} />
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate text-panel-ink">
                  {SECTION_LABELS[section.type]}
                </p>
                <p className="text-panel-muted text-xs">
                  {section.visible ? "Visível" : "Oculta"}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={section.visible}
                  onChange={() => onToggle(section.id)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-panel-border peer-focus:outline-none rounded-full peer peer-checked:bg-denim after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
              </label>
              <button
                type="button"
                onClick={() => onEdit(section.id)}
                className="px-4 py-2 bg-denim hover:bg-denim-dark text-white rounded-lg text-sm font-semibold shrink-0 transition-colors"
              >
                Editar
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-semibold text-xl mb-1 text-panel-ink">Configurações gerais</h2>
        <StitchDivider className="ml-0 mr-auto mb-4" />
        <div className="space-y-2">
          {[
            { id: "site", label: "Site (título, descrição)" },
            { id: "contatos", label: "Contatos e links" },
            { id: "header", label: "Menu e logo" },
            { id: "footer", label: "Rodapé" },
            { id: "politica", label: "Página de política" },
          ].map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setGlobalEdit(globalEdit === id ? null : id)}
              className="w-full text-left bg-panel-surface border border-panel-border rounded-xl p-4 font-medium text-panel-ink hover:border-denim/40 transition-colors shadow-sm"
            >
              {label}
            </button>
          ))}
        </div>

        {globalEdit === "site" && (
          <div className="mt-4 space-y-3 bg-panel-surface border border-panel-border rounded-xl p-4">
            <Field
              label="Título do site (Google)"
              value={content.site.title}
              onChange={(v) =>
                onEditGlobal("site", { ...content.site, title: v })
              }
            />
            <Field
              label="Descrição (Google)"
              value={content.site.description}
              onChange={(v) =>
                onEditGlobal("site", { ...content.site, description: v })
              }
              multiline
            />
            <Field
              label="Endereço do site"
              value={content.site.url ?? ""}
              onChange={(v) => onEditGlobal("site", { ...content.site, url: v })}
              hint="Usado nos textos da aba Divulgar"
            />
          </div>
        )}

        {globalEdit === "contatos" && (
          <div className="mt-4 space-y-3 bg-panel-surface border border-panel-border rounded-xl p-4">
            <Field
              label="WhatsApp (número com DDI)"
              value={content.contatos.whatsappNumber}
              onChange={(v) =>
                onEditGlobal("contatos", {
                  ...content.contatos,
                  whatsappNumber: v,
                })
              }
              hint="Ex: 5511960614120"
              inputMode="numeric"
            />
            <Field
              label="Mensagem padrão do WhatsApp"
              value={content.contatos.whatsappMessage}
              onChange={(v) =>
                onEditGlobal("contatos", {
                  ...content.contatos,
                  whatsappMessage: v,
                })
              }
              multiline
            />
            <Field
              label="Instagram"
              value={content.contatos.instagram}
              onChange={(v) =>
                onEditGlobal("contatos", { ...content.contatos, instagram: v })
              }
            />
            <Field
              label="Link Hotmart — Oficina da Calça Jeans"
              value={content.contatos.hotmartOficina}
              onChange={(v) =>
                onEditGlobal("contatos", {
                  ...content.contatos,
                  hotmartOficina: v,
                })
              }
            />
            <Field
              label="Link Hotmart — Pilotando Tudo"
              value={content.contatos.hotmartPilotando}
              onChange={(v) =>
                onEditGlobal("contatos", {
                  ...content.contatos,
                  hotmartPilotando: v,
                })
              }
            />
          </div>
        )}

        {globalEdit === "header" && (
          <div className="mt-4 space-y-3 bg-panel-surface border border-panel-border rounded-xl p-4">
            <Field
              label="Nome no menu"
              value={content.header.name}
              onChange={(v) =>
                onEditGlobal("header", { ...content.header, name: v })
              }
            />
            <Field
              label="Tagline"
              value={content.header.tagline}
              onChange={(v) =>
                onEditGlobal("header", { ...content.header, tagline: v })
              }
            />
            <p className="text-sm text-panel-muted mt-2">Itens do menu</p>
            {content.header.navLinks.map((link, i) => (
              <div key={link.id} className="flex gap-2 items-end">
                <Field
                  label={`Item ${i + 1}`}
                  value={link.label}
                  onChange={(v) => {
                    const navLinks = [...content.header.navLinks];
                    navLinks[i] = { ...link, label: v };
                    onEditGlobal("header", { ...content.header, navLinks });
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {globalEdit === "footer" && (
          <div className="mt-4 space-y-3 bg-panel-surface border border-panel-border rounded-xl p-4">
            <Field
              label="Nome no copyright"
              value={content.footer.copyrightName}
              onChange={(v) =>
                onEditGlobal("footer", {
                  ...content.footer,
                  copyrightName: v,
                })
              }
            />
            <Field
              label="Texto do link de política"
              value={content.footer.politicaLabel}
              onChange={(v) =>
                onEditGlobal("footer", {
                  ...content.footer,
                  politicaLabel: v,
                })
              }
            />
          </div>
        )}

        {globalEdit === "politica" && (
          <div className="mt-4 space-y-3 bg-panel-surface border border-panel-border rounded-xl p-4">
            <Field
              label="Data da última atualização"
              value={content.politica.lastUpdated}
              onChange={(v) =>
                onEditGlobal("politica", {
                  ...content.politica,
                  lastUpdated: v,
                })
              }
              hint="Formato: AAAA-MM-DD"
            />
            {content.politica.sections.map((sec, i) => (
              <div key={sec.title} className="border-t border-panel-border pt-3">
                <Field
                  label={`Seção ${i + 1} — título`}
                  value={sec.title}
                  onChange={(v) => {
                    const sections = [...content.politica.sections];
                    sections[i] = { ...sec, title: v };
                    onEditGlobal("politica", {
                      ...content.politica,
                      sections,
                    });
                  }}
                />
                <Field
                  label="Conteúdo"
                  value={sec.content}
                  onChange={(v) => {
                    const sections = [...content.politica.sections];
                    sections[i] = { ...sec, content: v };
                    onEditGlobal("politica", {
                      ...content.politica,
                      sections,
                    });
                  }}
                  multiline
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PublishTab({
  hasChanges,
  publishing,
  deployStatus,
  versions,
  onPublish,
  onRestore,
}: {
  hasChanges: boolean;
  publishing: boolean;
  deployStatus: string;
  versions: { id: number; published_at: string; label: string | null }[];
  onPublish: () => void;
  onRestore: (id: number) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="bg-panel-surface border border-panel-border rounded-xl p-6 text-center shadow-sm">
        <Rocket size={40} className="mx-auto text-denim mb-4" />
        <h2 className="font-semibold text-xl mb-2 text-panel-ink">
          Publicar no site
        </h2>
        <p className="text-panel-muted text-sm mb-6">
          Suas alterações ficam salvas como rascunho. Ao publicar, o site será
          reconstruído em cerca de 1 a 2 minutos.
        </p>
        <button
          type="button"
          onClick={onPublish}
          disabled={publishing || !hasChanges}
          className="w-full py-4 bg-denim text-white font-bold rounded-xl text-lg disabled:opacity-40 hover:bg-denim-dark transition-colors"
        >
          {publishing ? "Publicando..." : "Publicar agora"}
        </button>
        {!hasChanges && (
          <p className="text-panel-muted text-xs mt-3">
            Nenhuma alteração pendente
          </p>
        )}
        {deployStatus && (
          <p className="text-panel-success text-sm mt-4">{deployStatus}</p>
        )}
      </div>

      <div>
        <h3 className="font-semibold mb-3 text-panel-ink">Histórico de versões</h3>
        {versions.length === 0 ? (
          <p className="text-panel-muted text-sm">Nenhuma versão publicada ainda.</p>
        ) : (
          <div className="space-y-2">
            {versions.map((v) => (
              <div
                key={v.id}
                className="flex items-center justify-between bg-panel-surface border border-panel-border rounded-lg px-4 py-3"
              >
                <span className="text-sm text-panel-ink">
                  {new Date(v.published_at).toLocaleString("pt-BR")}
                </span>
                <button
                  type="button"
                  onClick={() => onRestore(v.id)}
                  className="text-denim text-sm font-semibold"
                >
                  Restaurar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SettingsTab({
  onChangePassword,
  deferredPrompt,
  showIosInstall,
  installed,
  onInstall,
}: {
  onChangePassword: (current: string, newPass: string) => Promise<void>;
  deferredPrompt: BeforeInstallPromptEvent | null;
  showIosInstall: boolean;
  installed: boolean;
  onInstall: () => void;
}) {
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    setErr("");
    try {
      await onChangePassword(current, newPass);
      setMsg("Senha alterada com sucesso!");
      setCurrent("");
      setNewPass("");
    } catch (error) {
      setErr(error instanceof Error ? error.message : "Erro");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-denim-light border border-denim/30 rounded-xl p-4">
        <div className="flex items-center gap-3 mb-3">
          <Download size={24} className="text-denim-dark shrink-0" />
          <div>
            <p className="font-semibold text-panel-ink">Painel como aplicativo</p>
            <p className="text-panel-muted text-sm">
              Abra o painel direto da tela do celular
            </p>
          </div>
        </div>
        {installed ? (
          <p className="text-sm text-panel-success">
            Pronto! O painel já está instalado neste aparelho.
          </p>
        ) : deferredPrompt ? (
          <button
            type="button"
            onClick={onInstall}
            className="w-full py-3 bg-denim hover:bg-denim-dark text-white font-bold rounded-lg min-h-[44px] transition-colors"
          >
            Instalar agora
          </button>
        ) : showIosInstall ? (
          <ol className="text-sm text-panel-muted space-y-1.5 list-decimal list-inside">
            <li>
              Toque no botão <strong className="text-panel-ink">Compartilhar</strong> (quadrado com uma
              seta para cima), na barra do Safari
            </li>
            <li>
              Role a lista e toque em{" "}
              <strong className="text-panel-ink">Adicionar à Tela de Início</strong>
            </li>
            <li>
              Toque em <strong className="text-panel-ink">Adicionar</strong>
            </li>
          </ol>
        ) : (
          <p className="text-sm text-panel-muted">
            Para instalar, abra o painel no celular pelo Chrome (Android) ou
            Safari (iPhone). No computador, use o ícone de instalação na barra
            de endereço.
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 bg-panel-surface border border-panel-border rounded-xl p-4">
        <h2 className="font-semibold text-xl text-panel-ink">Alterar senha</h2>
        <Field
          label="Senha atual"
          value={current}
          onChange={setCurrent}
          type="password"
        />
        <Field
          label="Nova senha"
          value={newPass}
          onChange={setNewPass}
          type="password"
        />
        {msg && <p className="text-panel-success text-sm">{msg}</p>}
        {err && <p className="text-panel-danger text-sm">{err}</p>}
        <button
          type="submit"
          className="w-full py-3 bg-panel-bg border border-panel-border hover:bg-denim-light rounded-lg font-semibold text-panel-ink transition-colors"
        >
          Salvar nova senha
        </button>
      </form>
    </div>
  );
}

function SectionEditor({
  section,
  onBack,
  onPreview,
  onChange,
}: {
  section: SiteSection;
  onBack: () => void;
  onPreview: () => void;
  onChange: (section: SiteSection) => void;
}) {
  return (
    <div className="min-h-screen flex flex-col pb-6 bg-panel-bg">
      <header className="sticky top-0 z-40 bg-panel-surface/95 backdrop-blur border-b border-panel-border px-4 py-3 flex items-center justify-between safe-top">
        <button type="button" onClick={onBack} className="text-denim text-sm font-semibold">
          ← Voltar
        </button>
        <span className="font-semibold text-sm text-panel-ink">
          {SECTION_LABELS[section.type]}
        </span>
        <button
          type="button"
          onClick={onPreview}
          className="flex items-center gap-1 text-denim text-sm"
        >
          <Eye size={16} /> Ver
        </button>
      </header>

      <div className="flex-1 px-4 py-6 max-w-2xl mx-auto w-full space-y-4">
        <SectionFields section={section} onChange={onChange} />
      </div>
    </div>
  );
}

function SectionFields({
  section,
  onChange,
}: {
  section: SiteSection;
  onChange: (s: SiteSection) => void;
}) {
  switch (section.type) {
    case "hero":
      return (
        <>
          <Field label="Título principal" value={section.title} onChange={(v) => onChange({ ...section, title: v })} />
          <Field label="Subtítulo" value={section.subtitle} onChange={(v) => onChange({ ...section, subtitle: v })} multiline />
          <Field label="Texto do botão principal" value={section.primaryButton.text} onChange={(v) => onChange({ ...section, primaryButton: { ...section.primaryButton, text: v } })} />
          <Field label="Texto do botão WhatsApp" value={section.secondaryButton.text} onChange={(v) => onChange({ ...section, secondaryButton: { ...section.secondaryButton, text: v } })} />
          <ListEditor
            label="Selos de confiança"
            items={section.trustBadges}
            onChange={(items) => onChange({ ...section, trustBadges: items })}
          />
        </>
      );
    case "paraVoce":
      return (
        <>
          <Field label="Título da seção" value={section.title} onChange={(v) => onChange({ ...section, title: v })} />
          {section.cards.map((card, i) => (
            <div key={card.id} className="bg-panel-surface border border-panel-border rounded-xl p-4 space-y-3">
              <p className="text-sm font-semibold text-denim">Card {i + 1}</p>
              <Field label="Título" value={card.title} onChange={(v) => {
                const cards = [...section.cards];
                cards[i] = { ...card, title: v };
                onChange({ ...section, cards });
              }} />
              <Field label="Descrição" value={card.description} onChange={(v) => {
                const cards = [...section.cards];
                cards[i] = { ...card, description: v };
                onChange({ ...section, cards });
              }} multiline />
              <ListActions
                onDelete={() => onChange({ ...section, cards: section.cards.filter((c) => c.id !== card.id) })}
                onMoveUp={() => moveItem(section.cards, i, -1, (cards) => onChange({ ...section, cards }))}
                onMoveDown={() => moveItem(section.cards, i, 1, (cards) => onChange({ ...section, cards }))}
                canUp={i > 0}
                canDown={i < section.cards.length - 1}
              />
            </div>
          ))}
          <AddButton label="Adicionar card" onClick={() => onChange({
            ...section,
            cards: [...section.cards, { id: createId("card"), icon: "scissors", title: "Novo card", description: "" }],
          })} />
        </>
      );
    case "cursos":
      return (
        <>
          <Field label="Título da seção" value={section.title} onChange={(v) => onChange({ ...section, title: v })} />
          {section.cursos.map((curso, i) => (
            <div key={curso.id} className="bg-panel-surface border border-panel-border rounded-xl p-4 space-y-3">
              <p className="text-sm font-semibold text-denim">{curso.title}</p>
              <Field label="Subtítulo" value={curso.subtitle} onChange={(v) => { const cursos = [...section.cursos]; cursos[i] = { ...curso, subtitle: v }; onChange({ ...section, cursos }); }} />
              <Field label="Descrição" value={curso.description} onChange={(v) => { const cursos = [...section.cursos]; cursos[i] = { ...curso, description: v }; onChange({ ...section, cursos }); }} multiline />
              <Field label="Texto do botão" value={curso.buttonText} onChange={(v) => { const cursos = [...section.cursos]; cursos[i] = { ...curso, buttonText: v }; onChange({ ...section, cursos }); }} />
              <ListEditor label={curso.learnLabel} items={curso.learnList} onChange={(items) => { const cursos = [...section.cursos]; cursos[i] = { ...curso, learnList: items }; onChange({ ...section, cursos }); }} />
              <ListEditor label={curso.bonusLabel} items={curso.bonusList} onChange={(items) => { const cursos = [...section.cursos]; cursos[i] = { ...curso, bonusList: items }; onChange({ ...section, cursos }); }} />
            </div>
          ))}
        </>
      );
    case "autoridade":
      return (
        <>
          <Field label="Título" value={section.title} onChange={(v) => onChange({ ...section, title: v })} />
          <ListEditor label="Parágrafos (use **texto** para negrito)" items={section.paragraphs} onChange={(items) => onChange({ ...section, paragraphs: items })} />
          <Field label="Título dos diferenciais" value={section.highlightsTitle} onChange={(v) => onChange({ ...section, highlightsTitle: v })} />
          <ListEditor label="Diferenciais" items={section.highlights} onChange={(items) => onChange({ ...section, highlights: items })} />
          <Field label="Texto do botão" value={section.buttonText} onChange={(v) => onChange({ ...section, buttonText: v })} />
        </>
      );
    case "provaSocial":
      return (
        <>
          <Field label="Título" value={section.title} onChange={(v) => onChange({ ...section, title: v })} />
          {section.depoimentos.map((dep, i) => (
            <div key={dep.id} className="bg-panel-surface border border-panel-border rounded-xl p-4 space-y-3">
              <p className="text-sm font-semibold text-denim">Depoimento {i + 1}</p>
              <Field label="Nome" value={dep.nome} onChange={(v) => { const depoimentos = [...section.depoimentos]; depoimentos[i] = { ...dep, nome: v }; onChange({ ...section, depoimentos }); }} />
              <Field label="Texto" value={dep.texto} onChange={(v) => { const depoimentos = [...section.depoimentos]; depoimentos[i] = { ...dep, texto: v }; onChange({ ...section, depoimentos }); }} multiline />
              <ListActions
                onDelete={() => onChange({ ...section, depoimentos: section.depoimentos.filter((d) => d.id !== dep.id) })}
                onMoveUp={() => moveItem(section.depoimentos, i, -1, (depoimentos) => onChange({ ...section, depoimentos }))}
                onMoveDown={() => moveItem(section.depoimentos, i, 1, (depoimentos) => onChange({ ...section, depoimentos }))}
                canUp={i > 0}
                canDown={i < section.depoimentos.length - 1}
              />
            </div>
          ))}
          <AddButton label="Adicionar depoimento" onClick={() => onChange({
            ...section,
            depoimentos: [...section.depoimentos, { id: createId("dep"), nome: "Nome", texto: "Depoimento...", estrelas: 5 }],
          })} />
        </>
      );
    case "faq":
      return (
        <>
          <Field label="Título" value={section.title} onChange={(v) => onChange({ ...section, title: v })} />
          <Field label="Texto do botão de dúvidas" value={section.ctaText} onChange={(v) => onChange({ ...section, ctaText: v })} />
          {section.items.map((item, i) => (
            <div key={item.id} className="bg-panel-surface border border-panel-border rounded-xl p-4 space-y-3">
              <p className="text-sm font-semibold text-denim">Pergunta {i + 1}</p>
              <Field label="Pergunta" value={item.pergunta} onChange={(v) => { const items = [...section.items]; items[i] = { ...item, pergunta: v }; onChange({ ...section, items }); }} />
              <Field label="Resposta" value={item.resposta} onChange={(v) => { const items = [...section.items]; items[i] = { ...item, resposta: v }; onChange({ ...section, items }); }} multiline />
              <ListActions
                onDelete={() => onChange({ ...section, items: section.items.filter((it) => it.id !== item.id) })}
                onMoveUp={() => moveItem(section.items, i, -1, (items) => onChange({ ...section, items }))}
                onMoveDown={() => moveItem(section.items, i, 1, (items) => onChange({ ...section, items }))}
                canUp={i > 0}
                canDown={i < section.items.length - 1}
              />
            </div>
          ))}
          <AddButton label="Adicionar pergunta" onClick={() => onChange({
            ...section,
            items: [...section.items, { id: createId("faq"), pergunta: "Nova pergunta?", resposta: "Resposta..." }],
          })} />
        </>
      );
    default:
      return null;
  }
}

function ListEditor({
  label,
  items,
  onChange,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
}) {
  return (
    <div>
      <p className="text-sm font-medium text-panel-ink/80 mb-2">{label}</p>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={item}
              onChange={(e) => {
                const next = [...items];
                next[i] = e.target.value;
                onChange(next);
              }}
              className="flex-1 bg-panel-bg border border-panel-border rounded-lg px-3 py-2.5 text-base text-panel-ink focus:outline-none focus:border-denim focus:ring-2 focus:ring-denim/20 min-h-[44px]"
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="p-2 text-panel-danger shrink-0"
              aria-label="Remover"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...items, ""])}
        className="mt-2 text-denim text-sm flex items-center gap-1"
      >
        <Plus size={16} /> Adicionar item
      </button>
    </div>
  );
}

function ListActions({
  onDelete,
  onMoveUp,
  onMoveDown,
  canUp,
  canDown,
}: {
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canUp: boolean;
  canDown: boolean;
}) {
  return (
    <div className="flex gap-2 pt-2">
      <button type="button" onClick={onMoveUp} disabled={!canUp} className="p-2 bg-panel-bg border border-panel-border text-panel-ink rounded disabled:opacity-30">
        <ChevronUp size={16} />
      </button>
      <button type="button" onClick={onMoveDown} disabled={!canDown} className="p-2 bg-panel-bg border border-panel-border text-panel-ink rounded disabled:opacity-30">
        <ChevronDown size={16} />
      </button>
      <button type="button" onClick={onDelete} className="p-2 bg-panel-danger-bg text-panel-danger rounded ml-auto">
        <Trash2 size={16} />
      </button>
    </div>
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full py-3 border border-dashed border-denim/40 text-denim rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
    >
      <Plus size={16} /> {label}
    </button>
  );
}

function moveItem<T>(
  arr: T[],
  index: number,
  direction: -1 | 1,
  setter: (items: T[]) => void
) {
  const target = index + direction;
  if (target < 0 || target >= arr.length) return;
  const next = [...arr];
  [next[index], next[target]] = [next[target], next[index]];
  setter(next);
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}
