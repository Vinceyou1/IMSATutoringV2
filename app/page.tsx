'use client'
import './page.css'
import Image from 'next/image'
import { useContext, useEffect, useState } from 'react'
import Loading from '@/components/Loading';
import { MobileContext } from '@/contexts/MobileContext';

export default function Home() {
  const [loading, updateLoading] = useState(true);
  const isMobile = useContext(MobileContext);

  useEffect(() => {
    updateLoading(false);
  }, [])

  if(loading){
    return (
      <Loading />
    )
  }
  const img1 = isMobile ? <></> : <img alt="" src='/thinking-person.png' className='h-[32rem]'/>
  const img2 = isMobile ? <></> : <Image src='/peertutoring1.jpg' alt="" />
  const img3 = isMobile ? <></> : <Image src='/Page2IMG2.png' alt=""/>

  const br = isMobile ? <></> : <br />
  return(
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='' />
      <div className = "w-full bg-[url(/scattered-forcefields.svg)] bg-cover h-fit pb-20 border-b-2">
        <div className={"flex flex-row justify-between items-center ml-auto mr-auto mt-20 " + (isMobile ? 'w-[80%]' : 'w-[72rem]')}>
          <div>
            <div>
              <h1 className="maintext">Peer Tutoring <br /> For IMSA Students <br /> Like You</h1>
              <br />
              <h1 className = "maindesc">Get 1-ON-1 Homework Help {br} Led By Verified IMSA Tutors</h1>
              <br />
            </div>
            <div className = "button">
              <a href="/tutors"><button className="learn">Learn Now!</button></a>
            </div>
          </div>
          {img1}
        </div>
      </div>
      <div className = "flex flex-center flex-col justify-items-center w-full bg-[55%] bg-[url(/scattered-forcefields3.svg)] bg-cover h-fit pb-20">
        <div className={"flex flex-row justify-between items-end mt-20 ml-auto mr-auto " + (isMobile ? 'w-[80%]' : 'w-[72rem]')}>
          {isMobile ? <></> : <div></div>}
          <div className=''>
            <div className = "text-right">
              <h1 className="Text">STRUGGLING WITH SCHOOLWORK?</h1>
              <br /><h1 className = "desc">Get one-on-one tutoring from {br} certified IMSA students. </h1>
              <br />
            </div>
            <div className = "button float-right">
              <a href="/tutors"><button className="learn">Find Help!</button></a>
            </div>
          </div>
        </div>
        <div className={"flex flex-row justify-between items-end mt-20 ml-auto mr-auto " + (isMobile ? 'w-[80%]' : 'w-[72rem]')}>
          <div>
            <div>
                <h1 className="Text">DOZENS OF COURSES</h1>
                <br />
                <h1 className = {"desc break-normal" + (isMobile ? " w-[80%]": "")}>No matter what class you need help in, {br} we&apos;ll have a tutor for you. </h1>
                <br />
            </div>
            <div className = "button">
              <a href="/tutors"><button className="learn">Explore Courses!</button></a>
            </div>
          </div>
          {isMobile ? <></> : <div></div>}
        </div>
        <div className={"flex flex-row justify-between items-end mt-20 ml-auto mr-auto " + (isMobile ? 'w-[80%]' : 'w-[72rem]')}>
          {isMobile ? <></> : <div></div>}
          <div>
            <div className = "text-right">
              <h1 className="Text">A TUTOR THAT FITS YOU</h1>
              <br /><h1 className = "desc">With over 100 volunteers, we&apos;ll have a peer tutor {br} that matches your learning style.</h1>
              <br />
            </div>
            <div className = "button float-right">
              <a href="/tutors"><button className="learn">Schedule Now!</button></a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
