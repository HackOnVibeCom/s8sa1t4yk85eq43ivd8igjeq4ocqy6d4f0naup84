import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CANIGO — Know Before You Go',
  description: 'Community-powered, evidence-backed place accessibility information.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
