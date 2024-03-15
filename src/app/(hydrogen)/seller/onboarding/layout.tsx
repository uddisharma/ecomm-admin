'use client';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-r from-[#136A8A] to-[#267871] @container">
      {children}
    </div>
  );
}
