import styles from "./page.module.css";
import Inventory from "./components/Inventory";
import AddItemForm from "./components/AddItemForm";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.page}>
      <nav className={styles.navbar}>
      <Link href="/volunteer" className={styles.navLink}>
  Volunteer
</Link>
<Link href="/organization" className={styles.navLink}>
  Organization
</Link>
<Link href="/donations" className={styles.navLink}>
  Donations
</Link>
      </nav>
      <main className={styles.main}>
        <h1>Home</h1>
        <p>Welcome to Columbia University's Food Pantry.</p>
        <p>Join our food pantry initiative to make a meaningful impact in your community! We offer opportunities to volunteer at events, make donations to support those in need, and host events to help distribute essential food and supplies to those facing hunger and food insecurity.</p>
      </main>
    </div>
  );
}
