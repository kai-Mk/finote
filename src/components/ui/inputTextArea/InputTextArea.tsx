import React from 'react';
import s from './inputTextArea.module.scss';
import { useFormContext } from 'react-hook-form';

type InputTextAreaProps = {
  id: string;
  name: string;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  className?: string;
};

const InputTextArea = ({
  id,
  name,
  placeholder,
  rows = 4,
  maxLength,
  className,
}: InputTextAreaProps) => {
  const { register, watch } = useFormContext();

  const currentValue = watch(name);

  return (
    <div className={s.input_text_area_wrapper}>
      <textarea
        id={id}
        className={`${s.input_text_area} ${className ? className : ''}`}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        {...register(name)}
      ></textarea>
      {/* 文字数カウント表示 */}
      {maxLength && (
        <div className={s.character_count}>
          <span
            className={currentValue.length >= maxLength ? s.over_limit : ''}
          >
            {currentValue.length}
          </span>
          <span>/{maxLength}</span>
        </div>
      )}
    </div>
  );
};

export default InputTextArea;
