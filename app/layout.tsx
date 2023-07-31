import { FirebaseProvider } from '@/contexts/FirebaseContext'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { UserDataProvider } from '@/contexts/UserContext'
import { MobileProvider } from '@/contexts/MobileContext'
import Header from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'IMSA Tutoring',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className='h-full'>
      <body className={inter.className + ' h-full bg-primary dark:bg-primary-dark text-[black] dark:text-[white]'}>
        <FirebaseProvider>
        <UserDataProvider>
        <MobileProvider>
          <Header />
          {children}
        </MobileProvider>
        </UserDataProvider>
        </FirebaseProvider>
      </body>
    </html>
  )
}
