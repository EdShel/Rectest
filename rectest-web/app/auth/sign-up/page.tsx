"use client";

import React, { useState } from "react";
import InputField from "@/app/ui/InputField";
import isEmailValid from "@/utils/isEmailValid";
import { signIn } from "next-auth/react";
import useForm from "@/utils/useForm";

export default function SignUp() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      userName: "",
    },
    validation: {
      email: (email) => (isEmailValid(email) ? null : "Invalid email"),
    },
    async onSubmit(values) {
      let res: Response;
      try {
        res = await fetch("/api/auth/sign-up", {
          method: "POST",
          body: JSON.stringify(values),
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch {
        setSubmitError("Unexpected error");
        return;
      }
      if (!res.ok) {
        const resBody = await res.json();
        setSubmitError(resBody.error);
        return;
      }
      await signIn("credentials", { username: values.email, password: values.password, callbackUrl: "/" });
    },
  });

  return (
    <main>
      <h1>Sign up</h1>
      <p>{submitError}</p>
      <InputField
        labelText="Name"
        name="userName"
        value={form.values.userName}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
        error={form.errors.userName}
        required
      />
      <InputField
        labelText="Email"
        name="email"
        value={form.values.email}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
        error={form.errors.email}
        required
      />
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
      <button onClick={form.handleSubmit} disabled={form.isSubmitting || Object.values(form.errors).length > 0}>
        Register
      </button>
    </main>
  );
}
