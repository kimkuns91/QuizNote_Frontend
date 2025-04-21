'use client';

import { AbstractIntlMessages, NextIntlClientProvider } from 'next-intl';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import RootLayout from '@/components/layout/RootLayout';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';
import { usePathname } from 'next/navigation';

interface IProvidersProps {
  children: React.ReactNode;
  messages: AbstractIntlMessages;
  locale: string;
  timeZone: string;
}

export function Providers({ children, messages, locale, timeZone }: IProvidersProps) {
  const pathname = usePathname();
  const isAiRoute = pathname?.startsWith('/dashboard') 
  || pathname?.startsWith('/lectures')
  || pathname?.startsWith('/notes')
  || pathname?.startsWith('/quiz')
  || pathname?.startsWith('/wrong-notes')
  || pathname?.startsWith('/login');

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });

  const content = isAiRoute ? children : <RootLayout>{children}</RootLayout>;

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <NextIntlClientProvider locale={locale} messages={messages} timeZone={timeZone}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {content}
            <Toaster
              position="top-center"
              toastOptions={{
                duration: 5000,
                style: {
                  maxWidth: '500px',
                  padding: '16px',
                  background: 'var(--background)',
                  color: 'var(--foreground)',
                  border: '1px solid var(--border)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                },
                success: {
                  iconTheme: {
                    primary: 'var(--success)',
                    secondary: 'white',
                  },
                },
                error: {
                  iconTheme: {
                    primary: 'var(--destructive)',
                    secondary: 'white',
                  },
                },
              }}
            />
          </ThemeProvider>
        </NextIntlClientProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}