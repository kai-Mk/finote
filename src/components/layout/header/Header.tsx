import React from 'react';
import s from './header.module.scss';

const Header = () => {
  return (
    <header className={s.header}>
      <h1 className={s.logo}>finote</h1>
      <div className={s.user_info}></div>
    </header>
  );
};

export default Header;
