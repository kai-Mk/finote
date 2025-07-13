'use client';

import s from './dashboard.module.scss';
import Header from '@/components/layout/header/Header';
import Sidebar from '@/components/layout/sidebar/Sidebar';
import { useState } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpenSidebar, setIsOpenSidebar] = useState(true);
  return (
    <div className={s.app}>
      <Header />
      <main className={s.main}>
        <Sidebar
          isOpenSidebar={isOpenSidebar}
          setIsOpenSidebar={setIsOpenSidebar}
        />
        <div
          className={`${s.container} ${isOpenSidebar ? s.sidebar_open : s.sidebar_closed}`}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
