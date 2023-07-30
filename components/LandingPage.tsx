
import Image from 'next/image'
import './LandingPage.css'
import Footer from './Footer'

export default function LandingPage ({isMobile}: {isMobile: boolean}) {
  const img1 = isMobile ? <></> : <img src='/thinking-person.png' className='h-[32rem] mr-[5%]'/>
  const img2 = isMobile ? <></> : <img src='/Page2IMG1.png' alt="" />
  const img3 = isMobile ? <></> : <img src='/Page2IMG2.png' alt=""/>
  const br = isMobile ? <></> : <br />
  return(
    <main className='min-h-full'>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='' />
      <div className = "relative w-full bg-[url(/scattered-forcefields.svg)] dark:bg-[url(/scattered-forcefields-dark.svg)] bg-cover h-fit pb-20 border-b-2">
        <div className="flex flex-row justify-between items-end w-full">
          <div className = "ml-[10%] mt-[10%]">
            <div>
                <h1 className="maintext">Peer Tutoring <br /> For IMSA Students <br /> Like You</h1>
                <br />
                <h1 className = "maindesc">Get 1-ON-1 Homework Help {br} Led By Verified IMSA Tutors</h1>
                <br />
            </div>
            <div className = "button">
                <form action="https://imsatutors.herokuapp.com/Courses">
                    <button className="learn">Learn Now!</button>
                </form>
            </div>
          </div>
          {img1}
        </div>
        
      </div>
      <div className = "relative w-full bg-[75%] bg-[url(/scattered-forcefields4.svg)] dark:bg-[url(/scattered-forcefields4-dark.svg)] bg-cover h-fit pb-20 border-b-2">
        <div className="flex flex-row justify-between items-end w-[90%] ml-[10%]">
          {img2}
          <div className = "mr-[5%] mt-[10%]">
            <div className = "text-right">
              <h1 className="Text">STRUGGLING WITH SCHOOLWORK?</h1>
              <br /><h1 className = "desc">Get live, one-on-one tutoring {br} from certified IMSA students. </h1>
              <br />
            </div>
            <div className = "button float-right">
              <form action="https://imsatutors.herokuapp.com/Courses">
                <button className="learn">Get Live Help!</button>
              </form>    
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-row justify-between items-end w-[85%] mr-[5%] float-right">
          <div>
            <div className = "maincontent">
                <h1 className="Text">DOZENS OF {isMobile ? <br /> : <></>}COURSES</h1>
                <br />
                <h1 className = {"desc break-normal" + (isMobile ? " w-[80%]": "")}>No matter what class you need help in, {br} we'll have a tutor for you. </h1>
                <br />
            </div>
            <div className = "button">
                <form action="https://imsatutors.herokuapp.com/Courses">
                    <button className="learn">Explore Courses!</button>
                </form>    
            </div>
          </div>
          {img3}
        </div>
        <div className="flex flex-row justify-between items-end w-[90%] ml-[10%]">
          {img2}
          <div className = "mr-[5%] mt-[10%]">
            <div className = "text-right">
              <h1 className="Text">SCHEDULE ANYTIME</h1>
              <br /><h1 className = "desc">With over 100 volunteers, a peer tutor will be available {br} whenever you need them.</h1>
              <br />
            </div>
            <div className = "button float-right">
              <form action="https://imsatutors.herokuapp.com/Courses">
                <button className="learn">Get Live Help!</button>
              </form>    
            </div>
          </div>
        </div>
      </div>
      <Footer />
      {/* <div className = "container container5">
          <p className="links">
          <a className="footlink" href="https://www3.imsa.edu/wp-content/uploads/2013/04/academic_support.pdf">IMSA Academic Support Services</a>
          <br />
          <br />
          <a className="footlink" href="https://www.imsa.edu/academics/academic-programs/">IMSA Academic Programs</a>
          <br />
          <br />
          <a className="footlink" href="https://www.imsa.edu/academics/campus-resources/">Campus Resources</a>
          <br />
          <br />
          <a className="footlink" href="https://www.imsa.edu/academics/the-writing-center/">Writing Center</a>
          <br />
          <br />
          <a className="credits" href="">Made by Vidyoot Senthilvenkatesh and Sahil Veeravalli</a>
          </p>
          <div className="RightContainer">
              <Image src={logo} alt="" />
          </div>
      </div> */}
    </main>
  )
}
