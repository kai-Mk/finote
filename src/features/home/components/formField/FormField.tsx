import React, { ReactNode } from 'react';
import s from './formField.module.scss';

type FormFieldProps = {
  id: string;
  label: string;
  required?: boolean;
  helperText?: string;
  children: ReactNode;
  errorMsg: string | undefined;
};

const FormField = ({
  id,
  label,
  required,
  helperText,
  children,
  errorMsg,
}: FormFieldProps) => {
  return (
    <div className={s.form_field}>
      <label className={s.form_label} htmlFor={id}>
        {label}
        {required && <span className={s.required}>必須</span>}
      </label>
      {helperText && <p className={s.helper_text}>{helperText}</p>}
      {children}
      {errorMsg && <span className={s.error_message}>{errorMsg}</span>}
    </div>
  );
};

export default FormField;
