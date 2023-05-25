"use client";

import InputField from "@/app/ui/InputField";
import isEmailValid from "@/utils/isEmailValid";
import useForm from "@/utils/useForm";
import { signIn } from "next-auth/react";
import { useMemo } from "react";
import styles from "./SingInForm.module.css";

export default function SignInForm() {
  const submitError = useMemo(() => {
    const query = new URLSearchParams(window.location.search);
    const error = query.get("error");
    switch (error) {
      case "CredentialsSignin":
        return "Invalid credentials";
      default:
        return null;
    }
  }, [window.location.search]);

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validation: {
      email: (email) => (isEmailValid(email) ? null : "Invalid email"),
      password: (password) => (password.length >= 5 ? null : "Password must be at least 5 characters long"),
    },
    async onSubmit(values) {
      await signIn("credentials", { username: values.email, password: values.password, callbackUrl: "/" });
    },
  });

  return (
    <main>
      <h1 className={styles.header}>Sign in</h1>
      <p className={styles.error}>{submitError || Object.values(form.errors)[0]}</p>
      <InputField
        labelText="Email"
        name="email"
        value={form.values.email}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
        error={form.errors.email}
        required
      />
      <br />
      <InputField
        type="password"
        labelText="Password"
        name="password"
        value={form.values.password}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
        error={form.errors.password}
        required
      />
      <button
        className={styles.submitButton}
        onClick={form.handleSubmit}
        disabled={form.isSubmitting || Object.values(form.errors).length > 0}
      >
        Login
      </button>
    </main>
  );
}
