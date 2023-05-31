"use client";

import styles from "./index.module.css";

import failedIcon from "@/public/failed-icon.svg";
import successIcon from "@/public/success-icon.svg";
import Image from "next/image";

interface TestResultProps {
  isSuccess: boolean;
  videoBase64: string;
  errorMessage: string | null;
  testFile: string;
  performance?: {
    ProcessorTime: string;
    ThreadsCount: number;
    Ram: number;
  };
}

export default function TestResult({ isSuccess, errorMessage, testFile, videoBase64, performance }: TestResultProps) {
  return (
    <div className={styles.container}>
      <div>
        <div className={styles.titleRow}>
          <Image
            src={!isSuccess ? failedIcon : successIcon}
            alt={!isSuccess ? "Failed" : "Success"}
            className={styles.icon}
          />
          <p className={styles.title}>Test {testFile}</p>
        </div>
        <div className={styles.values}>
          {!!errorMessage && (
            <div className={styles.value}>
              <span>Error:</span>
              <span>{errorMessage}</span>
            </div>
          )}
          <div className={styles.value}>
            <span>Startup time:</span>
            <span>{performance?.ProcessorTime ?? "N/A"}</span>
          </div>
          <div className={styles.value}>
            <span>Threads count:</span>
            <span>{performance?.ThreadsCount ?? "N/A"}</span>
          </div>
          <div className={styles.value}>
            <span>RAM usage:</span>
            <span>{performance?.Ram ?? "N/A"}</span>
          </div>
        </div>
      </div>
      <video src={`data:video/mp4;base64,${videoBase64}`} controls className={styles.video} />
    </div>
  );
}
