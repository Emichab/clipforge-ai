import "./globals.css";

export const metadata = {
  title: "ClipForge AI — Video Clipper con IA",
  description: "Sube tu video, genera subtítulos dinámicos con IA, detecta clips virales y exporta listos para TikTok, Reels y Shorts.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@400;500;700;800;900&family=Oswald:wght@400;500;600;700&family=Poppins:wght@400;500;600;700;800;900&family=Righteous&family=Bangers&family=Permanent+Marker&family=Anton&family=Russo+One&family=Black+Ops+One&family=Bungee&family=Passion+One:wght@400;700;900&family=Archivo+Black&family=Lilita+One&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
