import { ChangeEvent, useRef, useState } from "react";

type ValidationRules<T> = {
  [key in keyof T]?: (value: string) => string | null | undefined;
};

interface CreateFormData<T extends FormValues> {
  initialValues: T;
  validation?: ValidationRules<T>;
  onSubmit(values: T): Promise<any>;
}

interface FormValues {
  [key: string]: string;
}

export default function useForm<T extends FormValues>({ initialValues, validation, onSubmit }: CreateFormData<T>) {
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState<{ [key in keyof T]?: boolean | undefined }>({});
  const [isSubmitting, setSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);

  const errors: { [key in keyof T]?: string } = {};
  if (validation) {
    Object.keys(values).forEach((field: keyof T) => {
      const validate = validation[field];
      if (!validate) {
        return;
      }

      const error = validate(values[field]);
      if (error) {
        errors[field] = error;
      }
    });
  }

  return {
    values,
    handleChange: (e: ChangeEvent<HTMLInputElement>) => {
      setValues((old) => ({ ...old, [e.target.name]: e.target.value }));
    },
    errors,
    touched,
    handleBlur: (e: React.FocusEvent<HTMLInputElement>) => {
      setTouched((old) => ({ ...old, [e.target.name]: true }));
    },
    async handleSubmit() {
      if (Object.values(errors).length > 0) {
        return;
      }

      if (isSubmittingRef.current) {
        return;
      }

      isSubmittingRef.current = true;
      setSubmitting(true);

      try {
        await onSubmit(values);
      } finally {
        isSubmittingRef.current = false;
        setSubmitting(false);
      }
    },
    isSubmitting,
  };
}
