import styles from "./page.module.css";
import Inventory from "./components/Inventory";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Home</h1>
        <p>Welcome to Columbia University Food Pantry.</p>
        <Inventory />
      </main>
    </div>
  );
}
