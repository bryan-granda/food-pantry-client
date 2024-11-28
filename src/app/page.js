import styles from "./page.module.css";
import Inventory from "./components/Inventory";
import AddItemForm from "./components/AddItemForm";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Home</h1>
        <p>Welcome to Columbia University's Food Pantry.</p>
        <Link href="/events">See Upcoming Events Here</Link>
        <p>The following items are available for people dealing with shelter and food Insecurity.</p>
        <AddItemForm />
        <Inventory />
        <Link href="/volunteer">
          <button className={styles.volunteerButton}>Volunteer</button>
        </Link>
      </main>
    </div>
  );
}
