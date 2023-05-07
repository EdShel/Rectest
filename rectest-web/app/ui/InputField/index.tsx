'use client'

import React, { useId } from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

interface InputFieldProps {
  labelText: string;
  value: string;
  name: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onBlur: React.FocusEventHandler<HTMLInputElement>;
  type?: React.HTMLInputTypeAttribute;
  className?: string;
  error?: string | null;
  required?: boolean;
  autoFocus?: boolean;
}

const InputField = ({
  labelText,
  value,
  name,
  onChange,
  onBlur,
  type = "text",
  className,
  error,
  required,
  autoFocus = false,
}: InputFieldProps) => {
  const inputId = useId();

  return (
    <div className={clsx(styles["top-space-keeper"], className)}>
      <div className={styles.container}>
        <input
          name={name}
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={error ? styles.invalid : undefined}
          autoFocus={autoFocus}
        />
        <label htmlFor={inputId}>
          {labelText}
          {required && <sup>*</sup>}
        </label>
      </div>
    </div>
  );
};

export default InputField;
