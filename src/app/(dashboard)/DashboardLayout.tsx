'use client';

import Header from '@/components/layout/header/Header';
import styles from './dashboard.module.scss';
import Sidebar from '@/components/layout/sidebar/Sidebar';
import { useState } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpenSidebar, setIsOpenSidebar] = useState(true);
  return (
    <div className={styles.app}>
      <Header />
      <main className={styles.main}>
        <Sidebar
          isOpenSidebar={isOpenSidebar}
          setIsOpenSidebar={setIsOpenSidebar}
        />
        <div
          className={`${styles.container} ${isOpenSidebar ? styles.sidebar_open : styles.sidebar_closed}`}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
