/** Root layout — locale-specific html/body live in [locale]/layout.tsx */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
