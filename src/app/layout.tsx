import "@/styles/globals.css";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js with Mantine",
  description: "Next.js app with Mantine UI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <MantineProvider>{children}</MantineProvider>
      </body>
    </html>
  );
}
