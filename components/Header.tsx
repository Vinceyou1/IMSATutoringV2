'use client'

import { FirebaseAuthContext } from "@/contexts/FirebaseContext"
import { MobileContext } from "@/contexts/MobileContext";
import { UserDataContext } from "@/contexts/UserContext";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useContext, useState } from "react"

export default function Header(){
  const provider = new GoogleAuthProvider();
  const auth = useContext(FirebaseAuthContext);
  const user = useContext(UserDataContext);
  const isMobile = useContext(MobileContext);
  const [sidebarActive, setSideBarActive] = useState(false);
  const signIn = async () => {
    try{  
      await signInWithPopup(auth, provider);
    } catch {}
  }
  let navbar = <></>;
  const signInOutCommon = 'duration-200 pt-3 pb-3 pl-4 pr-4 text-lg shadow-xl rounded-none mr-4 text-secondary dark:text-secondary-dark hover:text-primary hover:dark:text-primary-dark'
  let signInOut = <></>;

  const sidebar = isMobile ?
  <div className={"ease-in-out z-10 absolute h-full w-3/5 bg-[white] dark:dark:bg-[#334155] top-0 border-r-[grey] border-r-2 rounded-r-sm " + (sidebarActive ? "left-0 duration-[400ms]" : "-left-[60%] duration-200")}>
    <div className="flex flex-row m-4 justify-between">
      <ul>
        <li className='text-2xl mb-2'><a href="/">Home</a></li>
        <li className='text-2xl mb-2'><a href="/courses">Courses</a></li>
        <li className='text-2xl mb-2'><a href="/tutor">Tutor</a></li>
        <li className='text-2xl mb-2'><a href="/help">Help</a></li>
      </ul>
      <button onClick={() => setSideBarActive(!sidebarActive)} className="text-3xl h-fit">&#x2573;</button>
    </div>
  </div> : <></>
  if(auth){
    user ? signInOut = (<button className={signInOutCommon + ' hover:bg-[#ff6666]'} 
        onClick={() => auth.signOut()}>Sign Out</button>) : 
      signInOut = (<button className={signInOutCommon + ' hover:bg-secondary hover:dark:bg-secondary-dark' }
        onClick={() => signIn()}>Sign in</button>);
    // Menu icon by Icons8
    navbar = isMobile ? 
      <button onClick={() => setSideBarActive(!sidebarActive)} className="ml-[5%] bg-[url(/icons8-menu-black.svg)] dark:bg-[url(/icons8-menu-white.svg)] bg-cover h-8 w-8"/> : 
      <ul className="ml-6">
        <li className='mr-10 inline'><a href="/">Home</a></li>
        <li className='mr-10 inline'><a href="/courses">Courses</a></li>
        <li className='mr-10 inline'><a href="/tutor">Tutor</a></li>
        <li className='mr-10 inline'><a href="/help">Help</a></li>
      </ul>;
  }
  
  return(
    <div className="h-[10%] bg-[white] dark:bg-[#334155] flex items-center justify-between border-b-2 border-[grey] w-full">
      {sidebar}
      {navbar}
      {signInOut}
    </div>
  )
}