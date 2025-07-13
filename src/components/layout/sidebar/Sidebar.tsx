'use client';

import React, { useState } from 'react';
import styles from './sidebar.module.scss';
import {
  ChartLine,
  ChevronLeft,
  ChevronRight,
  Coins,
  CreditCard,
  House,
} from 'lucide-react';
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
    <nav
      className={`${styles.sidebar} ${isOpenSidebar ? styles.open : styles.closed}`}
    >
      <div className={styles.toggle_sidebar}>
        <button
          className={styles.toggle_button}
          onClick={() => setIsOpenSidebar(!isOpenSidebar)}
          aria-label={isOpenSidebar ? 'サイドバーを閉じる' : 'サイドバーを開く'}
        >
          {isOpenSidebar ? (
            <ChevronLeft size={24} className={styles.toggle_icon} />
          ) : (
            <ChevronRight size={24} className={styles.toggle_icon} />
          )}
        </button>
      </div>
      <ul className={styles.nav_list}>
        {navItemData.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.href;

          return (
            <li key={item.id} className={styles.nav_item}>
              <Link
                href={item.href}
                className={`${styles.nav_link} ${isActive ? styles.active : ''}`}
                title={!isOpenSidebar ? item.label : ''}
              >
                <Icon size={32} className={styles.nav_icon} />
                <span
                  className={`${styles.nav_text} ${!isOpenSidebar ? styles.hidden : ''}`}
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
