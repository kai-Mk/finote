import React from 'react';
import styles from './header.module.scss';

const Header = () => {
  return (
    <header className={styles.header}>
      <h1 className={styles.logo}>finote</h1>
      <div className={styles.user_info}></div>
    </header>
  );
};

export default Header;
