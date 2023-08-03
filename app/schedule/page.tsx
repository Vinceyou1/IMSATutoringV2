'use client'
import Loading from "@/components/Loading";
import { FirebaseAuthContext } from "@/contexts/FirebaseContext"
import { UserDataContext } from "@/contexts/UserContext";
import { TutorData } from "@/types/tutordata";
import { useContext, useEffect, useState } from "react"
import tutors from '../../data/tutor_data.json'
import { MobileContext } from "@/contexts/MobileContext";
import Footer from "@/components/Footer";

export default function MySchedule(){
  const user = useContext(UserDataContext);
  const isMobile = useContext(MobileContext);
  
  const [tutor, updateTutor] = useState<TutorData>();
  const [tutorExists, updateTutorExists] = useState(true);

  useEffect(() => {
    if(!user){
      updateTutorExists(false);
      return;
    }

    // const name = user.displayName.split(" ");
    const name = "Vidyoot Senthilvenkatesh".split(" ");
    let first_name = "";
    let last_name = "";
    // Weird middle name handling, sometimes counted as part of either first or last name in data
    let first_name_alt = "";
    let last_name_alt = "";
    if(name.length == 2){
      first_name = name[0];
      last_name = name[1];
    } else {
      // Might have to deal with 4 word names at some point, else just get a map of emails to names
      first_name = name[0];
      last_name = name[1] + " " + name[2];
      first_name_alt = name[0] + " " + name[1];
      last_name_alt = name[2];
    }
    tutors.forEach((tutor: TutorData) => {
      if((tutor.first_name == first_name && tutor.last_name == last_name) ||
         (tutor.first_name == first_name_alt && tutor.last_name == last_name_alt)
      ){
        updateTutor(tutor);
        updateTutorExists(true);
      }
    });
  }, [user])

  if(user[1]){
    return (
      <main className="h-[calc(100%-5rem)]">
        <Loading />
      </main>
    )
  }

  if(!user[0]){
    return(
      <main className="flex items-center text-lg justify-center h-[calc(100%-5rem)] bg-[url(/scattered-forcefields5.svg)] dark:bg-[url(/scattered-forcefields5-dark.svg)] bg-cover bg-no-repeat">
        Please Sign In With Your IMSA email
      </main>
    )
  }

  if(tutorExists && !tutor){
    return (
      <main className="h-[calc(100%-5rem)]">
        <Loading />
      </main>
    )
  }

  if(!tutorExists){
    return (
      <main className="flex items-center justify-center text-center text-lg h-[calc(100%-5rem)] bg-[url(/scattered-forcefields5.svg)] dark:bg-[url(/scattered-forcefields5-dark.svg)] bg-cover bg-no-repeat">
        Hmm, you don't seem to be registered as a peer tutor. <br /> If you are, please fill out the help form.
      </main>
    )
  }
  
  return(
    <main className="flex flex-col justify-between pt-4 h-[calc(100%-5rem)] bg-[url(/scattered-forcefields5.svg)] dark:bg-[url(/scattered-forcefields5-dark.svg)] bg-cover bg-no-repeat">
      <div className="flex-grow flex flex-col justify-center ">
        <h1 className="text-center text-2xl">Welcome {user[0].displayName?.split(" ").at(0)}!</h1>
        <div className={"mt-20 flex justify-center items-center " + (isMobile ? "flex-col" : "flex-row")}>
          <a href="/schedule/weekly" className={"w-[min(20rem,100%)] text-center p-4 rounded-xl border-2 " + (isMobile ? "mb-4": "mr-10") }>
            <p>Update My Weekly Availability</p>
          </a>
          <a href="/schedule/daily" className={"w-[min(20rem,100%)] text-center p-4 rounded-xl border-2 " + (isMobile ? "mb-4": "")} >
            Edit a Specific Day
          </a>
        </div>
      </div>
      <Footer />
    </main>
  )
}