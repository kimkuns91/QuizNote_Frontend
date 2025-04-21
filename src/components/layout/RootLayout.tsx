import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex min-h-screen w-full flex-1 flex-col pt-16">{children}</main>
      <Footer />
    </div>
  );
}