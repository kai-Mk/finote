import { Loader2 } from 'lucide-react';
import React from 'react';
import s from './loading.module.scss';

const LoadingSpinner = () => {
  return <Loader2 className={s.spinner} size={48} />;
};

export default LoadingSpinner;
