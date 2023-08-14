import { FirebaseProvider } from '@/contexts/FirebaseContext'
import './globals.css'
import type { Metadata } from 'next'
import { Nunito_Sans } from 'next/font/google'
import { UserDataProvider } from '@/contexts/UserContext'
import { MobileProvider } from '@/contexts/MobileContext'
import Layout from '@/components/Layout'

const inter = Nunito_Sans({ subsets: ['latin'] })

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
          <Layout>
            {children}
          </Layout>
        </MobileProvider>
        </UserDataProvider>
        </FirebaseProvider>
      </body>
    </html>
  )
}
