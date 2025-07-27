import React from 'react';
import s from './inputTextArea.module.scss';

type InputTextAreaProps = {
  id: string;
};

const InputTextArea = ({ id }: InputTextAreaProps) => {
  return (
    <textarea
      id={id}
      className={s.input_text_area}
      placeholder="ここに入力してください"
    ></textarea>
  );
};

export default InputTextArea;
