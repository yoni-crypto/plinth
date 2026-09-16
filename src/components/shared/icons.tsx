import { cn } from "@/lib/utils";
import {
  Loader2,
  Github,
  Twitter,
  Mail,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Plus,
  Minus,
  Search,
  Settings,
  User,
  Users,
  CreditCard,
  Shield,
  Bell,
  FileText,
  Key,
  Webhook,
  Activity,
  BarChart3,
  Zap,
  Globe,
  Lock,
  LayoutDashboard,
  Server,
  Rocket,
  Home,
  LogOut,
  Menu,
  X,
  Copy,
  Trash2,
  Edit,
  ExternalLink,
  Download,
  Upload,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Monitor,
  type LucideIcon,
} from "lucide-react";

type IconProps = {
  className?: string;
  size?: number;
};

function createIcon(Icon: LucideIcon) {
  const IconComponent = ({ className, size = 16 }: IconProps) => (
    <Icon className={cn("shrink-0", className)} size={size} />
  );
  IconComponent.displayName = Icon.name;
  return IconComponent;
}

export const Icons = {
  spinner: createIcon(Loader2),
  github: createIcon(Github),
  twitter: createIcon(Twitter),
  mail: createIcon(Mail),
  checkCircle: createIcon(CheckCircle),
  alertCircle: createIcon(AlertCircle),
  arrowRight: createIcon(ArrowRight),
  arrowLeft: createIcon(ArrowLeft),
  chevronDown: createIcon(ChevronDown),
  chevronRight: createIcon(ChevronRight),
  plus: createIcon(Plus),
  minus: createIcon(Minus),
  search: createIcon(Search),
  settings: createIcon(Settings),
  user: createIcon(User),
  users: createIcon(Users),
  creditCard: createIcon(CreditCard),
  shield: createIcon(Shield),
  bell: createIcon(Bell),
  fileText: createIcon(FileText),
  key: createIcon(Key),
  webhook: createIcon(Webhook),
  activity: createIcon(Activity),
  barChart: createIcon(BarChart3),
  zap: createIcon(Zap),
  globe: createIcon(Globe),
  lock: createIcon(Lock),
  layoutDashboard: createIcon(LayoutDashboard),
  server: createIcon(Server),
  rocket: createIcon(Rocket),
  home: createIcon(Home),
  logOut: createIcon(LogOut),
  menu: createIcon(Menu),
  x: createIcon(X),
  copy: createIcon(Copy),
  trash: createIcon(Trash2),
  edit: createIcon(Edit),
  externalLink: createIcon(ExternalLink),
  download: createIcon(Download),
  upload: createIcon(Upload),
  eye: createIcon(Eye),
  eyeOff: createIcon(EyeOff),
  sun: createIcon(Sun),
  moon: createIcon(Moon),
  monitor: createIcon(Monitor),
  logo: createIcon(Zap),
  google: ({ className, size = 16 }: IconProps) => (
    <svg
      className={cn("shrink-0", className)}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  ),
};
