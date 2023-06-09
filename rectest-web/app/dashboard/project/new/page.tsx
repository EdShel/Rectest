"use client";

import InputField from "@/app/ui/InputField";
import useForm from "@/utils/useForm";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function New() {
  const router = useRouter();
  const form = useForm({
    initialValues: {
      name: "",
    },
    validation: {
      name(value) {
        if (value.length === 0) {
          return "Required field";
        }
        return null;
      },
    },
    async onSubmit(values) {
      const res = await fetch("/api/project", { method: "POST", body: JSON.stringify(values) });
      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      }
    },
  });

  return (
    <div className="container">
      <h1>Create new project</h1>
      <div className={styles.container}>
        <InputField
          labelText="Project name"
          name="name"
          value={form.values.name}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          error={form.errors.name}
          required
        />
        <button onClick={form.handleSubmit} className={styles.createButton}>
          Create project
        </button>
      </div>
    </div>
  );
}
