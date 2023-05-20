"use client";

import React from "react";
import { GameProject } from "@prisma/client";
import { useShowAlertNotification } from "@/utils/useShowAlertNotification";
import styles from "./styles.module.css";
import Link from "next/link";

interface ProjectItemProps {
  project: GameProject;
}

export default function ProjectItem({ project }: ProjectItemProps) {
  const { showInfo } = useShowAlertNotification();

  return (
    <div className={styles.container}>
      <p>Name: {project.name}</p>
      <p>Api key: ***************</p>
      <button
        onClick={() => {
          navigator.clipboard.writeText(project.apiKey);
          showInfo("API key successfully copied to clipboard!", { autoClose: true });
        }}
      >
        Copy API key
      </button>
      <Link href={`/dashboard/project/${project.id}`}>{">"}</Link>
    </div>
  );
}
