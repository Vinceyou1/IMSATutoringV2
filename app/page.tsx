'use client'
import { useContext } from 'react'
import { UserDataContext } from '@/contexts/UserContext'
import LandingPage from '@/components/LandingPage';
import { FirebaseAuthContext } from '@/contexts/FirebaseContext';
import Loading from '@/components/Loading';
import { MobileContext } from '@/contexts/MobileContext';

export default function Home() {
  const auth = useContext(FirebaseAuthContext);
  const user = useContext(UserDataContext);
  const isMobile = useContext(MobileContext);

  console.log(isMobile);
  if(!auth){
    return (
      <div className='h-full'>
        <Loading />
      </div>
    )
  }
  return (
    <div className='h-[calc(100%-5rem)]'>
      <LandingPage isMobile={isMobile}/>
    </div>
  )
}
