import React from 'react';
import s from './inputField.module.scss';
import { useFormContext } from 'react-hook-form';

type InputFieldProps = {
  id: string;
  type: string;
  name: string;
  placeholder: string;
  width?: string;
};

const InputField = ({
  id,
  type,
  name,
  placeholder,
  width,
}: InputFieldProps) => {
  const { register } = useFormContext();
  return (
    <input
      type={type}
      id={id}
      className={s.input_field}
      placeholder={placeholder}
      style={{ width: width }}
      {...register(name)}
    />
  );
};

export default InputField;
