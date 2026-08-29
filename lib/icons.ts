import {
  Scissors,
  Shirt,
  DollarSign,
  Ruler,
  GraduationCap,
  Award,
  Star,
  Heart,
  Clock,
  Users,
  ThumbsUp,
  Sparkles,
  ShoppingBag,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

/**
 * Catálogo central de ícones usados nos cards do site (ex.: seção "Este site
 * é para você"). Adicionar um novo ícone aqui já o disponibiliza tanto no
 * site público quanto no seletor do painel.
 */
export const ICON_OPTIONS: { id: string; label: string; icon: LucideIcon }[] = [
  { id: "scissors", label: "Tesoura", icon: Scissors },
  { id: "shirt", label: "Roupa", icon: Shirt },
  { id: "dollarSign", label: "Dinheiro", icon: DollarSign },
  { id: "ruler", label: "Régua", icon: Ruler },
  { id: "graduationCap", label: "Formatura", icon: GraduationCap },
  { id: "award", label: "Prêmio", icon: Award },
  { id: "star", label: "Estrela", icon: Star },
  { id: "heart", label: "Coração", icon: Heart },
  { id: "clock", label: "Tempo", icon: Clock },
  { id: "users", label: "Pessoas", icon: Users },
  { id: "thumbsUp", label: "Aprovação", icon: ThumbsUp },
  { id: "sparkles", label: "Brilho", icon: Sparkles },
  { id: "shoppingBag", label: "Compras", icon: ShoppingBag },
  { id: "trendingUp", label: "Crescimento", icon: TrendingUp },
];

export type IconName = (typeof ICON_OPTIONS)[number]["id"];

export const DEFAULT_ICON: IconName = "scissors";

export const ICON_MAP: Record<string, LucideIcon> = Object.fromEntries(
  ICON_OPTIONS.map((option) => [option.id, option.icon])
);

export function getIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? ICON_MAP[DEFAULT_ICON];
}
