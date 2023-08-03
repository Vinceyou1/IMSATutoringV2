'use client'
import { MobileContext } from "@/contexts/MobileContext"
import { useContext } from "react"
import './Footer.css'

export default function Footer(){
  const isMobile = useContext(MobileContext);
  const footer = isMobile ? <></> :
  <footer className="flex flex-row justify-between bg-primary dark:bg-primary-dark items-center p-2  border-t-2">
    <a className='pl-2 text-2xl overflow-hidden' href="https://www.imsa.edu/academics/academic-support-services/">IMSA Academic Support Services</a>
    <a href="https://github.com/Vinceyou1/IMSATutoringV2" className="bg-[url(/github-mark.svg)] dark:bg-[url(/github-mark-white.svg)] bg-contain"><img src='/github-mark.svg' className="invisible w-[3.075rem] h-12"></img></a>
  </footer>
  return footer
}