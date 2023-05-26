import styles from "./index.module.css";
import clsx from "clsx";

export default function CodeSection() {
  return (
    <section className={clsx("container", styles.container)}>
      <div className={styles.textInfo}>
        <h2>Almost no code!</h2>
        <p className={styles.subtext}>Easily integrate with your new and existing Unity 3D projects! Use Rectest package from Unity Asset Store and track player's input.</p>
      </div>
      <code>
        <span className={styles.keyword}>void </span>Start() {"{"}
        <br />
        {"  "}
        <span className={styles.class}>RInput</span>.Init(<span className={styles.memberVar}>this</span>);
        <br />
        {"}"}
        <br />
        <br />
        <span className={styles.keyword}>void </span>Update() {"{"}
        <br />
        {"  "}
        if (<span className={styles.class}>RInput</span>.GetKeyDown(<span className={styles.class}>KeyCode</span>.W){" "}
        {"{"}
        <br />
        {"    "}
        <span className={styles.comment}>// Handle presses as usual</span>
        <br />
        {"  }"}
        <br />
        {"}"}
        <br />
        <br />
        <span className={styles.keyword}>void </span>OnDestroy() {"{"}
        <br />
        {"  "}
        <span className={styles.class}>RInput</span>.Cleanup();
        <br />
        {"}"}
      </code>
    </section>
  );
}
