import React from 'react';
import s from './primaryButton.module.scss';

type PrimaryButtonProps = {
  label: string;
  className?: string;
  onButtonClick?: () => void;
};

const PrimaryButton = ({
  label,
  className,
  onButtonClick,
}: PrimaryButtonProps) => {
  return (
    <button
      className={`${s.primary_button}  ${className}`}
      onClick={onButtonClick}
    >
      {label}
    </button>
  );
};

export default PrimaryButton;
