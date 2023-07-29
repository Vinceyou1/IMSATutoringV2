'use client'

import { FirebaseAuthContext } from "@/contexts/FirebaseContext"
import { MobileContext } from "@/contexts/MobileContext";
import { UserDataContext } from "@/contexts/UserContext";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useContext } from "react"

export default function Header(){
  const provider = new GoogleAuthProvider();
  const auth = useContext(FirebaseAuthContext);
  const user = useContext(UserDataContext);
  const isMobile = useContext(MobileContext);
  const signIn = async () => {
    try{  
      const result = await signInWithPopup(auth, provider);
    } catch {}
  }
  let navbar = <></>;
  const signInOutCommon = 'duration-200 pt-3 pb-3 pl-4 pr-4 text-lg shadow-xl rounded-none mr-4 text-secondary dark:text-secondary-dark hover:text-primary hover:dark:text-primary-dark'
  let signInOut = <></>;
  if(auth){
    user ? signInOut = (<button className={signInOutCommon + ' hover:bg-[#ff6666]'} 
        onClick={() => auth.signOut()}>Sign Out</button>) : 
      signInOut = (<button className={signInOutCommon + ' hover:bg-secondary hover:dark:bg-secondary-dark' }
        onClick={() => signIn()}>Sign in</button>);
    // Menu icon by Icons8
    navbar = isMobile ? 
      <button className="ml-[5%] bg-[url(/icons8-menu-black.svg)] dark:bg-[url(/icons8-menu-white.svg)] bg-cover h-8 w-8"/> : 
      <ul className="ml-4">
        <li className='mr-10 inline'><a href="/">Home</a></li>
        <li className='mr-10 inline'><a href="/courses">Courses</a></li>
        <li className='mr-10 inline'><a href="/tutor">Tutor</a></li>
        <li className='mr-10 inline'><a href="/help">Help</a></li>
      </ul>;
  }
  
  return(
    <div className="h-[10%] bg-[white] dark:bg-[#334155] flex items-center justify-between border-b-2 border-[grey] w-full">
      {navbar}
      {signInOut}
    </div>
  )
}