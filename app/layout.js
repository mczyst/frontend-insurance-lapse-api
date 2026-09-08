import "./globals.css";
export const metadata = { title: "Lapse Risk Ledger" };
export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body style={{"--font-display":"Georgia, serif", "--font-mono":"Menlo, monospace", "--font-body":"Arial, sans-serif"}}>
        {children}
      </body>
    </html>
  );
}
