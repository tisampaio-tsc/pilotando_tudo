"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  LayoutGrid,
  Palette,
  Share2,
  Rocket,
  Settings,
  LogOut,
  Monitor,
  ChevronDown,
  Wifi,
  WifiOff,
  Download,
  Globe,
  Phone,
  FileText,
} from "lucide-react";
import type { SiteContent, SiteSection } from "@/lib/content-schema";
import { SECTION_LABELS } from "@/lib/content-schema";
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
import SiteHeader from "@/components/Header";
import SiteFooter from "@/components/Footer";
import LoginForm from "./LoginForm";
import Field from "./Field";
import ThemePicker from "./ThemePicker";
import ShareTab from "./ShareTab";
import StitchDivider from "./StitchDivider";
import EditableBlock from "./EditableBlock";
import HeaderEdit from "./inline/HeaderEdit";
import FooterEdit from "./inline/FooterEdit";
import HeroEdit from "./inline/HeroEdit";
import ParaVoceEdit from "./inline/ParaVoceEdit";
import CursosEdit from "./inline/CursosEdit";
import AutoridadeEdit from "./inline/AutoridadeEdit";
import ProvaSocialEdit from "./inline/ProvaSocialEdit";
import FaqEdit from "./inline/FaqEdit";

type Tab = "content" | "aparencia" | "share" | "publish" | "settings";
type PreviewMode = "site" | null;

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

  const updateSection = (id: string, updated: SiteSection) => {
    updateContent((prev) => ({
      ...prev,
      secoes: prev.secoes.map((s) => (s.id === id ? updated : s)),
    }));
  };

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
    return (
      <div className="min-h-screen bg-white admin-live-preview">
        <div className="sticky top-0 z-50 bg-denim-dark text-white px-4 py-3 flex items-center justify-between safe-top">
          <span className="font-semibold text-sm">
            Prévia do site — {getThemeOption(content.tema).name}
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
          <SiteHeader header={content.header} />
          {content.secoes
            .filter((s) => s.visible)
            .map((section) => (
              <SectionRenderer
                key={section.id}
                section={section}
                contatos={content.contatos}
              />
            ))}
          <SiteFooter footer={content.footer} contatos={content.contatos} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pb-24 bg-panel-bg">
      {/* Header */}
      <header className="jeans-weave sticky top-0 z-40 bg-panel-surface/95 backdrop-blur border-b border-panel-border px-4 py-3 safe-top">
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
          <div className="mb-6 bg-denim-light border border-denim/30 rounded-2xl p-4 shadow-sm">
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
                  className="btn-fabric flex-1 py-3 bg-denim hover:bg-denim-dark text-white font-bold rounded-lg min-h-[44px] transition-colors"
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
            onMoveSection={moveSection}
            onToggleSection={toggleSection}
            onUpdateSection={updateSection}
            onEditGlobal={(key, value) =>
              updateContent((prev) => ({ ...prev, [key]: value }))
            }
            onPreviewSite={() => setPreview("site")}
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
      <nav className="jeans-weave fixed bottom-0 left-0 right-0 bg-panel-surface border-t border-panel-border safe-bottom z-50">
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
              aria-current={tab === id ? "page" : undefined}
              className={`flex-1 flex flex-col items-center py-2.5 gap-1 text-[11px] leading-tight transition-colors ${
                tab === id
                  ? "text-denim-dark font-semibold"
                  : "text-panel-muted"
              }`}
            >
              <span
                className={`flex items-center justify-center w-12 h-7 rounded-full transition-colors ${
                  tab === id ? "bg-denim-light" : ""
                }`}
              >
                <Icon size={20} />
              </span>
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
  onMoveSection,
  onToggleSection,
  onUpdateSection,
  onEditGlobal,
  onPreviewSite,
}: {
  content: SiteContent;
  onMoveSection: (index: number, dir: -1 | 1) => void;
  onToggleSection: (id: string) => void;
  onUpdateSection: (id: string, section: SiteSection) => void;
  onEditGlobal: (key: "site" | "contatos" | "header" | "footer" | "politica", value: unknown) => void;
  onPreviewSite: () => void;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const toggleExpanded = (id: string) =>
    setExpanded((prev) => (prev === id ? null : id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold text-xl text-panel-ink">Seu site, em tempo real</h2>
          <StitchDivider className="ml-0 mr-auto mt-1 mb-1.5" />
          <p className="text-panel-muted text-sm">
            Toque em <strong className="text-denim-dark">Editar</strong> em qualquer parte.
            A mudança já aparece aqui, como rascunho.
          </p>
        </div>
        <button
          type="button"
          onClick={onPreviewSite}
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-panel-surface border border-panel-border rounded-lg text-xs font-semibold text-panel-ink shrink-0 hover:bg-denim-light transition-colors"
        >
          <Monitor size={15} /> Ver sem os botões
        </button>
      </div>

      <div className="admin-live-preview" data-theme={content.tema}>
        <EditableBlock
          label="Cabeçalho e menu"
          clip={false}
          expanded={expanded === "header"}
          onToggleExpand={() => toggleExpanded("header")}
          editing={
            <HeaderEdit
              header={content.header}
              onChange={(header) => onEditGlobal("header", header)}
            />
          }
        >
          <SiteHeader header={content.header} />
        </EditableBlock>

        {content.secoes.map((section, index) => (
          <EditableBlock
            key={section.id}
            label={SECTION_LABELS[section.type]}
            visible={section.visible}
            onToggleVisible={() => onToggleSection(section.id)}
            onMoveUp={() => onMoveSection(index, -1)}
            onMoveDown={() => onMoveSection(index, 1)}
            canMoveUp={index > 0}
            canMoveDown={index < content.secoes.length - 1}
            expanded={expanded === section.id}
            onToggleExpand={() => toggleExpanded(section.id)}
            editing={
              <SectionEdit
                section={section}
                onChange={(updated) => onUpdateSection(section.id, updated)}
              />
            }
          >
            <SectionRenderer
              section={{ ...section, visible: true }}
              contatos={content.contatos}
            />
          </EditableBlock>
        ))}

        <EditableBlock
          label="Rodapé"
          expanded={expanded === "footer"}
          onToggleExpand={() => toggleExpanded("footer")}
          editing={
            <FooterEdit
              footer={content.footer}
              onChange={(footer) => onEditGlobal("footer", footer)}
            />
          }
        >
          <SiteFooter footer={content.footer} contatos={content.contatos} />
        </EditableBlock>
      </div>

      <SettingsAccordion
        content={content}
        expanded={expanded}
        onToggleExpanded={toggleExpanded}
        onEditGlobal={onEditGlobal}
      />
    </div>
  );
}

type SettingsAccordionId = "site" | "contatos" | "politica";

const SETTINGS_ITEMS: {
  id: SettingsAccordionId;
  label: string;
  hint: string;
  icon: typeof Globe;
}[] = [
  {
    id: "site",
    label: "Site",
    hint: "Título, descrição e endereço",
    icon: Globe,
  },
  {
    id: "contatos",
    label: "Contatos e links",
    hint: "WhatsApp, Instagram e vendas",
    icon: Phone,
  },
  {
    id: "politica",
    label: "Página de política",
    hint: "Termos e privacidade",
    icon: FileText,
  },
];

function SettingsAccordion({
  content,
  expanded,
  onToggleExpanded,
  onEditGlobal,
}: {
  content: SiteContent;
  expanded: string | null;
  onToggleExpanded: (id: string) => void;
  onEditGlobal: (key: "site" | "contatos" | "header" | "footer" | "politica", value: unknown) => void;
}) {
  return (
    <div>
      <h2 className="font-semibold text-xl mb-1 text-panel-ink">Outras configurações</h2>
      <StitchDivider className="ml-0 mr-auto mb-4" />
      <div className="space-y-3">
        {SETTINGS_ITEMS.map(({ id, label, hint, icon: Icon }) => {
          const isOpen = expanded === id;
          return (
            <div
              key={id}
              className={`rounded-2xl shadow-sm overflow-hidden border-2 transition-colors ${
                isOpen
                  ? "border-denim bg-panel-surface"
                  : "border-panel-border bg-panel-surface"
              }`}
            >
              <button
                type="button"
                onClick={() => onToggleExpanded(id)}
                aria-expanded={isOpen}
                className="w-full flex items-center gap-3 p-4 text-left"
              >
                <span
                  className={`shrink-0 flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                    isOpen
                      ? "bg-denim text-white"
                      : "bg-denim-light text-denim-dark"
                  }`}
                >
                  <Icon size={18} />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block font-semibold text-panel-ink">
                    {label}
                  </span>
                  <span className="block text-panel-muted text-xs mt-0.5">
                    {hint}
                  </span>
                </span>
                <ChevronDown
                  size={20}
                  className={`shrink-0 text-panel-muted transition-transform ${
                    isOpen ? "rotate-180 text-denim" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="border-t-2 border-dashed border-stitch/40 p-4 space-y-3 bg-panel-bg/60">
                  {id === "site" && (
                    <SiteSettingsFields content={content} onEditGlobal={onEditGlobal} />
                  )}
                  {id === "contatos" && (
                    <ContatosSettingsFields content={content} onEditGlobal={onEditGlobal} />
                  )}
                  {id === "politica" && (
                    <PoliticaSettingsFields content={content} onEditGlobal={onEditGlobal} />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SiteSettingsFields({
  content,
  onEditGlobal,
}: {
  content: SiteContent;
  onEditGlobal: (key: "site", value: unknown) => void;
}) {
  return (
    <>
      <Field
        label="Título do site (Google)"
        value={content.site.title}
        onChange={(v) => onEditGlobal("site", { ...content.site, title: v })}
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
    </>
  );
}

function ContatosSettingsFields({
  content,
  onEditGlobal,
}: {
  content: SiteContent;
  onEditGlobal: (key: "contatos", value: unknown) => void;
}) {
  return (
    <>
      <Field
        label="WhatsApp (número com DDI)"
        value={content.contatos.whatsappNumber}
        onChange={(v) =>
          onEditGlobal("contatos", { ...content.contatos, whatsappNumber: v })
        }
        hint="Ex: 5511960614120"
        inputMode="numeric"
      />
      <Field
        label="Mensagem padrão do WhatsApp"
        value={content.contatos.whatsappMessage}
        onChange={(v) =>
          onEditGlobal("contatos", { ...content.contatos, whatsappMessage: v })
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
          onEditGlobal("contatos", { ...content.contatos, hotmartOficina: v })
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
    </>
  );
}

function PoliticaSettingsFields({
  content,
  onEditGlobal,
}: {
  content: SiteContent;
  onEditGlobal: (key: "politica", value: unknown) => void;
}) {
  return (
    <>
      <Field
        label="Data da última atualização"
        value={content.politica.lastUpdated}
        onChange={(v) =>
          onEditGlobal("politica", { ...content.politica, lastUpdated: v })
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
              onEditGlobal("politica", { ...content.politica, sections });
            }}
          />
          <Field
            label="Conteúdo"
            value={sec.content}
            onChange={(v) => {
              const sections = [...content.politica.sections];
              sections[i] = { ...sec, content: v };
              onEditGlobal("politica", { ...content.politica, sections });
            }}
            multiline
          />
        </div>
      ))}
    </>
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
      <div className="bg-panel-surface border border-panel-border rounded-2xl p-6 text-center shadow-sm">
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
          className="btn-fabric w-full py-4 bg-denim text-white font-bold rounded-xl text-lg disabled:opacity-40 hover:bg-denim-dark transition-colors"
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
      <div className="bg-denim-light border border-denim/30 rounded-2xl p-4 shadow-sm">
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
            className="btn-fabric w-full py-3 bg-denim hover:bg-denim-dark text-white font-bold rounded-lg min-h-[44px] transition-colors"
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

      <form onSubmit={handleSubmit} className="space-y-4 bg-panel-surface border border-panel-border rounded-2xl p-4 shadow-sm">
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

/** Escolhe a irmã editável correta para o tipo de seção, mantendo a mesma aparência do site. */
function SectionEdit({
  section,
  onChange,
}: {
  section: SiteSection;
  onChange: (s: SiteSection) => void;
}) {
  switch (section.type) {
    case "hero":
      return <HeroEdit data={section} onChange={onChange} />;
    case "paraVoce":
      return <ParaVoceEdit data={section} onChange={onChange} />;
    case "cursos":
      return <CursosEdit data={section} onChange={onChange} />;
    case "autoridade":
      return <AutoridadeEdit data={section} onChange={onChange} />;
    case "provaSocial":
      return <ProvaSocialEdit data={section} onChange={onChange} />;
    case "faq":
      return <FaqEdit data={section} onChange={onChange} />;
    default:
      return null;
  }
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}
