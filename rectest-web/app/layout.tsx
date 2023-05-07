import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "./Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Rectest",
  description: "Your Record and replay solution",
};

export default async function RootLayout({ children, ...otherProps }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
