import clsx from "clsx";
import React from "react";
import styles from "./styles.module.css";

interface LineLoaderProps {
  isLoading: boolean;
  loadTimeMilliseconds: number;
}

const LineLoader = ({ isLoading, loadTimeMilliseconds = 500 }: LineLoaderProps) => {
  return (
    <div
      style={{ "--load-time": `${loadTimeMilliseconds}ms` } as any}
      className={clsx(styles["line-loader"], isLoading ? styles.animate : styles.hide)}
    >
      <div className={styles["space-keep"]} />
    </div>
  );
};

export default LineLoader;
