import React from 'react';
import { cn } from '@/shared/utils/utils';
import { 
  Crown, Diamond, Shield, Trophy, Sword, Briefcase, Book, Scroll, Star, Medal, Flame, 
  Target, Share2, Edit2, Coins, Calendar, User, History, Copy, Check, TrendingUp, 
  Rocket, ArrowUp, ArrowDown, TrendingDown, PieChart, RefreshCw, Search, X, Users, 
  AlertCircle, ChevronUp, ChevronDown, ExternalLink, Home, Lightbulb, Lock, Sparkles, 
  Settings, Video, Volume2, Smartphone, Contrast, Accessibility, Type, Wallet, 
  BarChart, Clock, Swords, Triangle, Menu, Info, AlertTriangle, Sun, Moon, 
  Twitter, Send, Eye, Zap, Brain, Map, Gamepad2, Plane, LineChart, Building, Palette, Cpu, List, RotateCcw, Wine, Cross, LucideIcon,
  Flag, Train, Ship, Image, Waves, Footprints, CreditCard, Gem, ShoppingBag, PawPrint, Globe, Landmark, Satellite, Snowflake, Bot,
  Trees, Box, Heart, Activity, DollarSign, Quote
} from 'lucide-react';

export interface RoyalIconProps {
  size?: number;
  className?: string;
  variant?: 'crown' | 'diamond' | 'shield' | 'trophy' | 'sword' | 'chest' | 'book' | 'scroll' | 'star' | 'medal' | 'fire' | 'target' | 'share' | 'edit' | 'coin' | 'calendar' | 'user' | 'history' | 'copy' | 'check' | 'trend' | 'rocket' | 'arrowUp' | 'arrowDown' | 'trendDown' | 'pieChart' | 'refresh' | 'search' | 'close' | 'users' | 'error' | 'chevronUp' | 'chevronDown' | 'externalLink' | 'home' | 'lightbulb' | 'idea' | 'lock' | 'sparkles' | 'settings' | 'animation' | 'sound' | 'vibration' | 'contrast' | 'accessibility' | 'text' | 'wallet' | 'barChart' | 'clock' | 'swords' | 'pyramid' | 'menu' | 'coins' | 'info' | 'warning' | 'sun' | 'moon' | 'twitter' | 'send' | 'eye' | 'zap' | 'brain' | 'map' | 'lineChart' | 'building' | 'palette' | 'cpu' | 'list' | 'rotateCcw' | 'wine' | 'cross' | 'flag' | 'train' | 'ship' | 'image' | 'waves' | 'footprints' | 'gamepad' | 'creditCard' | 'gem' | 'shoppingBag' | 'paw' | 'discord' | 'telegram' | 'globe' | 'monument' | 'satellite' | 'snowflake' | 'robot' | 'tree' | 'mobile' | 'cube' | 'heart' | 'activity' | 'dollar-sign' | 'quote';
}

const ICON_MAP: Record<string, LucideIcon> = {
  crown: Crown,
  diamond: Diamond,
  shield: Shield,
  trophy: Trophy,
  sword: Sword,
  chest: Briefcase,
  book: Book,
  scroll: Scroll,
  star: Star,
  medal: Medal,
  fire: Flame,
  target: Target,
  share: Share2,
  edit: Edit2,
  coin: Coins,
  calendar: Calendar,
  user: User,
  history: History,
  copy: Copy,
  check: Check,
  trend: TrendingUp,
  rocket: Rocket,
  arrowUp: ArrowUp,
  arrowDown: ArrowDown,
  trendDown: TrendingDown,
  pieChart: PieChart,
  refresh: RefreshCw,
  search: Search,
  close: X,
  users: Users,
  error: AlertCircle,
  chevronUp: ChevronUp,
  chevronDown: ChevronDown,
  externalLink: ExternalLink,
  home: Home,
  lightbulb: Lightbulb,
  idea: Lightbulb,
  lock: Lock,
  sparkles: Sparkles,
  settings: Settings,
  animation: Video,
  sound: Volume2,
  vibration: Smartphone,
  contrast: Contrast,
  accessibility: Accessibility,
  text: Type,
  wallet: Wallet,
  barChart: BarChart,
  clock: Clock,
  swords: Swords,
  pyramid: Triangle,
  menu: Menu,
  coins: Coins,
  info: Info,
  warning: AlertTriangle,
  sun: Sun,
  moon: Moon,
  twitter: Twitter,
  send: Send,
  discord: Gamepad2,
  telegram: Plane,
  eye: Eye,
  zap: Zap,
  brain: Brain,
  map: Map,
  lineChart: LineChart,
  building: Building,
  palette: Palette,
  cpu: Cpu,
  list: List,
  rotateCcw: RotateCcw,
  wine: Wine,
  cross: Cross,
  flag: Flag,
  train: Train,
  ship: Ship,
  image: Image,
  waves: Waves,
  footprints: Footprints,
  gamepad: Gamepad2,
  creditCard: CreditCard,
  gem: Gem,
  shoppingBag: ShoppingBag,
  paw: PawPrint,
  globe: Globe,
  monument: Landmark,
  satellite: Satellite,
  snowflake: Snowflake,
  robot: Bot,
  tree: Trees,
  mobile: Smartphone,
  cube: Box,
  heart: Heart,
  activity: Activity,
  'dollar-sign': DollarSign,
  quote: Quote
};

export const RoyalIcon: React.FC<RoyalIconProps> = ({
  size = 32,
  className,
  variant = 'crown'
}) => {
  const IconComponent = ICON_MAP[variant] || Crown;

  return (
    <IconComponent 
      size={size}
      className={cn("inline-block", className)}
    />
  );
};
