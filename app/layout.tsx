import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "Mundo Lector — Aprendo con Alegría",
  description:
    "Ecosistema interactivo de lectoescritura para niños con autismo de 3 a 7 años. Aprendizaje sensorial con pictogramas, palabras y bloques físicos.",
  keywords: ["autismo", "lectoescritura", "niños", "TEACCH", "ARASAAC", "aprendizaje"],
  authors: [{ name: "Mundo Lector" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#FFF8EE",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={nunito.variable}>
      <body style={{ fontFamily: "'Nunito', system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
