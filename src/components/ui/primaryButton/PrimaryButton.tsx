import React from 'react';
import s from './primaryButton.module.scss';

type PrimaryButtonProps = {
  type?: 'button' | 'submit' | 'reset';
  label: string;
  className?: string;
  onButtonClick?: () => void;
};

const PrimaryButton = ({
  type = 'button',
  label,
  className,
  onButtonClick,
}: PrimaryButtonProps) => {
  return (
    <button
      type={type}
      className={`${s.primary_button}  ${className}`}
      onClick={onButtonClick}
    >
      {label}
    </button>
  );
};

export default PrimaryButton;
