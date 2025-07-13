import { ChartLine, Coins, CreditCard, House } from 'lucide-react';

export type NavItemData = {
  id: number;
  href: string;
  icon: React.ElementType;
  label: string;
};

export const navItemData = [
  {
    id: 0,
    href: '/',
    icon: House,
    label: 'ホーム',
  },
  {
    id: 1,
    href: '/fixed-cost',
    icon: CreditCard,
    label: '固定費管理',
  },
  {
    id: 2,
    href: '/investment',
    icon: ChartLine,
    label: '投資管理',
  },
  {
    id: 3,
    href: '/point',
    icon: Coins,
    label: 'ポイント管理',
  },
];
