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
  Trees, Box, Heart, Activity, DollarSign, Quote, Compass, GitCompare, Shuffle, Database, Layers, ArrowRight, Trash2, Download
} from 'lucide-react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

// Official Brand SVGs
const BRAND_ICONS: Record<string, React.FC<IconProps>> = {
  // Official Solana Logo (CDN)
  solana: (props: IconProps) => (
    <img 
      src="https://logo.svgcdn.com/token-branded/solana.svg" 
      alt="Solana" 
      {...props as unknown as React.ImgHTMLAttributes<HTMLImageElement>} 
      className={cn("object-contain", props.className)} 
      style={{ width: props.size || 24, height: props.size || 24 }}
    />
  ),
  // Official USDC Logo (CDN)
  usdc: (props: IconProps) => (
    <img 
      src="https://static.cdnlogo.com/logos/u/84/usd-coin.svg" 
      alt="USDC" 
      {...props as unknown as React.ImgHTMLAttributes<HTMLImageElement>}
      className={cn("object-contain", props.className)}
      style={{ width: props.size || 24, height: props.size || 24 }}
    />
  ),
  // X (Twitter) Logo
  x: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  // Alias for Twitter
  twitter: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  // Discord Logo
  discord: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.772-.6083 1.1588a18.2915 18.2915 0 00-5.4882 0 12.616 12.616 0 00-.6173-1.1632.077.077 0 00-.0793-.0376 19.7363 19.7363 0 00-4.8859 1.5161.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561 19.9031 19.9031 0 005.9937 3.0337.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057 13.111 13.111 0 01-1.872-8919.0779.0779 0 01-.0076-.1277c.1258-.0943.2517-.1892.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.1023.2462.1922.3718.2914a.077.077 0 01-.0069.1276 12.2986 12.2986 0 01-1.873.8919.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286 19.9003 19.9003 0 006.0028-3.0338.077.077 0 00.0322-.0544c.4233-4.5514-.5466-9.0835-3.5687-13.6365a.072.072 0 00-.032-.0277zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
    </svg>
  )
};

export interface RoyalIconProps {
  size?: number;
  className?: string;
  variant?: 'crown' | 'solana' | 'usdc' | 'discord' | 'twitter' | 'diamond' | 'shield' | 'trophy' | 'sword' | 'chest' | 'book' | 'scroll' | 'star' | 'medal' | 'fire' | 'target' | 'share' | 'edit' | 'coin' | 'calendar' | 'user' | 'history' | 'copy' | 'check' | 'trend' | 'rocket' | 'arrowUp' | 'arrowDown' | 'trendDown' | 'pieChart' | 'refresh' | 'search' | 'close' | 'users' | 'error' | 'chevronUp' | 'chevronDown' | 'externalLink' | 'home' | 'lightbulb' | 'idea' | 'lock' | 'sparkles' | 'settings' | 'animation' | 'sound' | 'vibration' | 'contrast' | 'accessibility' | 'text' | 'wallet' | 'barChart' | 'clock' | 'swords' | 'pyramid' | 'menu' | 'coins' | 'info' | 'warning' | 'sun' | 'moon' | 'send' | 'eye' | 'zap' | 'brain' | 'map' | 'lineChart' | 'building' | 'palette' | 'cpu' | 'list' | 'rotateCcw' | 'wine' | 'cross' | 'flag' | 'train' | 'ship' | 'image' | 'waves' | 'footprints' | 'gamepad' | 'creditCard' | 'gem' | 'shoppingBag' | 'paw' | 'telegram' | 'globe' | 'monument' | 'satellite' | 'snowflake' | 'robot' | 'tree' | 'mobile' | 'cube' | 'heart' | 'activity' | 'dollar-sign' | 'quote' | 'compass' | 'gitCompare' | 'shuffle' | 'database' | 'layers' | 'arrowRight' | 'flame' | 'trash' | 'download';
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
  compass: Compass,
  gitCompare: GitCompare,
  shuffle: Shuffle,
  database: Database,
  layers: Layers,
  arrowRight: ArrowRight,
  gamepad: Gamepad2,
  tree: Trees,
  mobile: Smartphone,
  cube: Box,
  heart: Heart,
  activity: Activity,
  'dollar-sign': DollarSign,
  quote: Quote,
  flame: Flame,
  trash: Trash2,
  download: Download
};

const RoyalIconComponent: React.FC<RoyalIconProps> = ({
  size = 32,
  className,
  variant = 'crown'
}) => {
  // Use Brand Icon if available, else Lucide, else Crown
  const BrandIcon = (BRAND_ICONS as Record<string, React.FC<IconProps>>)[variant];
  const IconComponent = BrandIcon || ICON_MAP[variant] || Crown;
  
  const isBrandIcon = !!BrandIcon;
  const isPremium = !isBrandIcon; // Only apply gold effect to Lucide icons for now

  if (isPremium) {
    return (
      <span className={cn("inline-flex items-center justify-center relative", className)} style={{ width: size, height: size }}>
        <IconComponent 
          size={size} 
          className="relative z-10 text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-400 to-yellow-600 drop-shadow-md" 
          strokeWidth={1.5}
        />
        {/* Glow effect */}
        <IconComponent 
          size={size} 
          className="absolute inset-0 z-0 text-yellow-500/30 blur-[2px]" 
          strokeWidth={3}
        />
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <IconComponent size={size} />
    </span>
  );
};

export const RoyalIcon = React.memo(RoyalIconComponent);
RoyalIcon.displayName = 'RoyalIcon';
