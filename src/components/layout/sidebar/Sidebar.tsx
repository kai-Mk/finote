'use client';

import React from 'react';
import s from './sidebar.module.scss';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navItemData } from './navItemData';

type SidebarProps = {
  isOpenSidebar: boolean;
  setIsOpenSidebar: (isOpen: boolean) => void;
};

const Sidebar = ({ isOpenSidebar, setIsOpenSidebar }: SidebarProps) => {
  const currentPath = usePathname();

  return (
    <nav className={`${s.sidebar} ${isOpenSidebar ? s.open : s.closed}`}>
      <div className={s.toggle_sidebar}>
        <button
          className={s.toggle_button}
          onClick={() => setIsOpenSidebar(!isOpenSidebar)}
          aria-label={isOpenSidebar ? 'サイドバーを閉じる' : 'サイドバーを開く'}
        >
          {isOpenSidebar ? (
            <ChevronLeft size={24} className={s.toggle_icon} />
          ) : (
            <ChevronRight size={24} className={s.toggle_icon} />
          )}
        </button>
      </div>
      <ul className={s.nav_list}>
        {navItemData.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.href;

          return (
            <li key={item.id} className={s.nav_item}>
              <Link
                href={item.href}
                className={`${s.nav_link} ${isActive ? s.active : ''}`}
                title={!isOpenSidebar ? item.label : ''}
              >
                <Icon size={32} className={s.nav_icon} />
                <span
                  className={`${s.nav_text} ${!isOpenSidebar ? s.hidden : ''}`}
                >
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Sidebar;
