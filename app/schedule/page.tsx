'use client'
import Loading from "@/components/Loading";
import { UserDataContext } from "@/contexts/UserContext";
import { useContext } from "react"
import { MobileContext } from "@/contexts/MobileContext";

export default function MySchedule(){
  const user = useContext(UserDataContext);
  const isMobile = useContext(MobileContext);

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

  return(
    <div className="w-full flex flex-col justify-center pt-4 bg-[right_35%_top_20%] bg-[url(/scattered-forcefields5.svg)] bg-cover bg-no-repeat ">
      <h1 className="text-center text-2xl">Welcome {user[0].displayName?.split(" ").at(0)}!</h1>
      <div className={"mt-20 flex justify-center items-center " + (isMobile ? "flex-col" : "flex-row")}>
        <a href="/schedule/booked" className={"w-[min(20rem,100%)] text-center p-4 rounded-xl border-2 " + (isMobile ? "mb-4": "mr-10") }>
          Booked Appointments
        </a>
        <a href="/schedule/tutor" className={"w-[min(20rem,100%)] text-center p-4 rounded-xl border-2 " + (isMobile ? "mb-4": "")} >
          Tutor Schedule
        </a>
      </div>
    </div>
  )
}