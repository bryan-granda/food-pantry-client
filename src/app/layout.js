import localFont from "next/font/local";
import "../../styles/globals.css";
import { SessionProvider } from '../context/SessionContext';

const geistSans = localFont({
  src: "../../styles/fonts/GeistMonoVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../../styles/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Columbia University Food Pantry",
  description: "Food pantry hosted by Columbia University to aid Homelessness with Food Insecurity.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
      <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}