'use client'
import Loading from "@/components/Loading";
import { UserDataContext } from "@/contexts/UserContext";
import { TutorData } from "@/lib/types";
import { useContext, useEffect, useState } from "react"
import tutors from '../../../public/tutor_data.json'
import { MobileContext } from "@/contexts/MobileContext";

export default function MySchedule(){
  const user = useContext(UserDataContext);
  const isMobile = useContext(MobileContext);
  
  const [tutor, updateTutor] = useState<TutorData>();
  const [tutorExists, updateTutorExists] = useState(false);

  useEffect(() => {
    if(user[1]){
      return;
    }
    if(!user[0]){
      updateTutorExists(false);
      return;
    }

    const email = user[0].email;
    tutors.forEach((tutor: TutorData) => {
      if(tutor.emailAddress == email){
        updateTutor(tutor);
        updateTutorExists(true);
      }
    });
  }, [user])

  if(user[1]){
    return (
      <Loading />
    )
  }

  if(!user[0]){
    return(
      <div className="flex items-center text-lg justify-center h-full bg-[url(/scattered-forcefields5.svg)] bg-cover bg-no-repeat">
        Please Sign In With Your IMSA email
      </div>
    )
  }

  if(tutorExists && !tutor){
    return (
        <Loading />
    )
  }

  if(!tutorExists){
    return (
      <div className="flex items-center justify-center text-center h-full text-lg bg-[url(/scattered-forcefields5.svg)] bg-cover bg-no-repeat">
        Hmm, you don&apos;t seem to be registered as a peer tutor. <br /> If you are, please fill out the help form.
      </div>
    )
  }
  
  return(
    <div className="h-full w-full flex flex-col justify-center pt-4 bg-[right_35%_top_20%] bg-[url(/scattered-forcefields5.svg)] bg-cover bg-no-repeat ">
      <h1 className="text-center text-2xl">Tutor Scheduling</h1>
      <div className={"mt-20 flex justify-center items-center " + (isMobile ? "flex-col" : "flex-row")}>
        <a href="/schedule/tutor/weekly" className={"w-[min(20rem,100%)] text-center p-4 rounded-xl border-2 " + (isMobile ? "mb-4": "mr-10") }>
          <p>Update My Weekly Availability</p>
        </a>
        <a href="/schedule/tutor/daily" className={"w-[min(20rem,100%)] text-center p-4 rounded-xl border-2 " + (isMobile ? "mb-4": "")} >
          Edit a Specific Day
        </a>
      </div>
    </div>
  )
}