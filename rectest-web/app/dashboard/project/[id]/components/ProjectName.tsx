"use client";

import { useRef, useState } from "react";
import styles from "./ProjectName.module.css";
import pencilIcon from "./pencil.svg";
import Image from "next/image";

interface ProjectNameProps {
  projectId: string;
  initialName: string;
}

export default function ProjectName({ projectId, initialName }: ProjectNameProps) {
  const [text, setText] = useState(initialName);
  const textInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={styles.container}>
      <Image src={pencilIcon} alt="Edit" className={styles.icon} />
      <input
        className={styles.input}
        ref={textInputRef}
        type="text"
        name="projectName"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={() => {
          fetch("/api/project/edit", {
            method: "POST",
            body: JSON.stringify({ id: projectId, name: text }),
          });
        }}
        onKeyDown={(e) => e.key === "Enter" && textInputRef.current?.blur()}
      />
    </div>
  );
}
