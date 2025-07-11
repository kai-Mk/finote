import React from 'react';
import styles from './sidebar.module.scss';
import { ChartLine, Coins, CreditCard, House } from 'lucide-react';
import Link from 'next/link';

const Sidebar = () => {
  return (
    <nav className={styles.sidebar}>
      <ul className={styles.nav_list}>
        <Link href="/">
          <li className={styles.nav_item}>
            <House size={32} />
            ホーム
          </li>
        </Link>
        <Link href="/fixed-cost">
          <li className={styles.nav_item}>
            <CreditCard size={32} />
            固定費管理
          </li>
        </Link>
        <Link href="/investment">
          <li className={styles.nav_item}>
            <ChartLine size={32} />
            投資管理
          </li>
        </Link>
        <Link href="/point">
          <li className={styles.nav_item}>
            <Coins size={32} />
            ポイント管理
          </li>
        </Link>
      </ul>
    </nav>
  );
};

export default Sidebar;
