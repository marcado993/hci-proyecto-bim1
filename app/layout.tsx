import type { Metadata, Viewport } from "next";
import { Nunito, Fredoka } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-nunito",
});

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-fredoka",
});

export const metadata: Metadata = {
  title: "Mundo Lector — ¡Aprendo con Alegría!",
  description:
    "Plataforma interactiva de lectoescritura para niños con autismo de 3 a 7 años. Aprende palabras con pictogramas, juegos y tu mascota.",
  keywords: ["autismo", "lectoescritura", "niños", "TEACCH", "ARASAAC", "aprendizaje"],
  authors: [{ name: "Mundo Lector" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#7B5CF6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${nunito.variable} ${fredoka.variable}`}>
      <body style={{ fontFamily: "'Nunito', system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
