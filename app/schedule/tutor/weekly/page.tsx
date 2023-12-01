'use client'
import { MobileContext } from "@/contexts/MobileContext";
import { UserDataContext } from "@/contexts/UserContext";
import { useContext, useEffect, useMemo, useState } from "react";
import tutors from '../../../../public/tutor_data.json'
import { TutorData } from "@/types/tutordata";
import Loading from "@/components/Loading";
import { LocalizationProvider, TimeClock } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { WeeklyAvailability } from "@/types/weeklyAvailability";
import { FirebaseFirestoreContext } from "@/contexts/FirebaseContext";
import { doc, getDoc, setDoc } from "firebase/firestore";

export type Weekday = "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";

export default function Weekly(){
  const user = useContext(UserDataContext);
  const isMobile = useContext(MobileContext);
  const db = useContext(FirebaseFirestoreContext);
  
  const [tutor, updateTutor] = useState<TutorData>();
  const [tutorExists, updateTutorExists] = useState(false);

  useEffect(() => {
    if(!user[0] || !user[0].displayName){
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

  

  const [activeDay, updateActiveDay] = useState<Weekday | "">("Sunday");
  const [AM, updateAM] = useState(true);
  const [currSelectedHour, updateCurrSelectedHour] = useState({
    "Sunday": -1,
    "Monday": -1,
    "Tuesday": -1,
    "Wednesday": -1,
    "Thursday": -1,
    "Friday": -1,
    "Saturday": -1,
  })
  const [availabilty, updateAvailability] = useState<WeeklyAvailability>({
    "Sunday": [],
    "Monday": [],
    "Tuesday": [],
    "Wednesday": [],
    "Thursday": [],
    "Friday": [],
    "Saturday": [],
  });

  useEffect(() => {
    const getData = async () =>{
      if(!tutor || !tutor.id) return;
      const tutorRef = doc(db, 'tutors', String(tutor.id));
      await getDoc(tutorRef).then((res) => {
        if(res.get('weekly')){
          updateAvailability(res.get('weekly'));
        }
      })
    }
    getData()
  }, [tutor, db])

  function time(slot: number, day: Weekday){
    const h = currSelectedHour[day] + (currSelectedHour[day] == 0 ? 12 : 0);
    let m = "00";
    switch(slot){
      case 0:
        m = "00";
        break;
      case 1:
        m = "30";
        break;
    }
    return h.toString() + ":" + m + " " + (AM ? "AM" : "PM");
  }

  function availabilityIncluded(slot: number, day: Weekday){
    return availabilty[day].includes(time(slot, day));
  }

  function handleAvailability(slot: number, day: Weekday){
    if(activeDay == "") return;
    const str = time(slot, day);
    const temp = JSON.parse(JSON.stringify(availabilty));
    if(availabilityIncluded(slot, activeDay)){
      temp[activeDay].splice(availabilty[activeDay].indexOf(str), 1);
    } else {
      temp[activeDay].push(str);
    }
    updateAvailability(temp)
  }

  const [saving, updateSaving] = useState(false);

  async function saveAvailability(){
    if(!tutor || !tutor.id){
      alert("Error! Are you signed in?");
      return;
    }
    const tutorRef = doc(db, 'tutors', String(tutor.id));
    updateSaving(true);
    await setDoc(tutorRef, { weekly: availabilty }, { merge: true }).catch(() => {
      alert("There's been an error. Please try again.");
    }).then(() => {
      updateSaving(false);
    });
  }

  if(user[1]){
    return (
      <Loading />
    )
  }

  if(!user[0]){
    return(
      <div className="flex items-center text-lg justify-center h-full">
        Please Sign In With Your IMSA email
      </div>
    )
  }

  if(!tutorExists){
    return (
      <div className="flex items-center justify-center text-center text-lg h-full">
        Hmm, you don&apos;t seem to be registered as a peer tutor. <br /> If you are, please fill out the help form.
      </div>
    )
  }
  // general idea: lots of collapsables, so one dropdown for each day, then a dropdown for each hour, then buttons for each 15-minute block and location
  if(!isMobile){
  return (
    <div className="flex flex-col justify-between h-full w-full bg-[url(/scattered-forcefields5.svg)] bg-cover bg-no-repeat bg-[right_35%]">
      <div className={"flex flex-col flex-grow h-fit justify-start m-4 mt-6"}>
        <div className="flex flex-row">
          <button onClick={() => updateActiveDay((activeDay == "Sunday") ? "" : "Sunday")} className="w-0 h-fit border-2 p-4 rounded-t-lg flex-grow mr-4">Sunday {(activeDay == "Sunday") ? "\u25B2" : "\u25BC"}</button>
          <button onClick={() => updateActiveDay((activeDay == "Monday") ? "" : "Monday")} className="w-0 h-fit border-2 p-4 rounded-t-lg flex-grow mr-4">Monday {(activeDay == "Monday") ? "\u25B2" : "\u25BC"}</button>
          <button onClick={() => updateActiveDay((activeDay == "Tuesday") ? "" : "Tuesday")} className="w-0 h-fit border-2 p-4 rounded-t-lg flex-grow mr-4">Tuesday {(activeDay == "Tuesday") ? "\u25B2" : "\u25BC"}</button>
          <button onClick={() => updateActiveDay((activeDay == "Wednesday") ? "" : "Wednesday")} className="w-0 h-fit border-2 p-4 rounded-t-lg flex-grow mr-4">Wednesday {(activeDay == "Wednesday") ? "\u25B2" : "\u25BC"}</button>
          <button onClick={() => updateActiveDay((activeDay == "Thursday") ? "" : "Thursday")} className="w-0 h-fit border-2 p-4 rounded-t-lg flex-grow mr-4">Thursday {(activeDay == "Thursday") ? "\u25B2" : "\u25BC"}</button>
          <button onClick={() => updateActiveDay((activeDay == "Friday") ? "" : "Friday")} className="w-0 h-fit border-2 p-4 rounded-t-lg flex-grow mr-4">Friday {(activeDay == "Friday") ? "\u25B2" : "\u25BC"}</button>
          <button onClick={() => updateActiveDay((activeDay == "Saturday") ? "" : "Saturday")} className="w-0 h-fit border-2 p-4 rounded-t-lg flex-grow">Saturday {(activeDay == "Saturday") ? "\u25B2" : "\u25BC"}</button>
        </div>
        <div className="flex flex-row">
          <div className={"dark:text-primary flex flex-col justify-start items-center w-0 overflow-x-hidden h-fit border-2 border-t-0 p-4 rounded-b-lg flex-grow mr-4 duration-300 " + (activeDay == "Sunday" ? "opacity-100" : "opacity-0 pointer-events-none")}>
            <div className="h-48">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimeClock ampm={true} sx={{
                    scale: "0.75",
                    transformOrigin: "top",
                    margin: 0,
                  }} onChange={(value) => {
                    const temp = JSON.parse(JSON.stringify(currSelectedHour));
                    temp.Sunday = value.$H;
                    updateCurrSelectedHour(temp);
                  }}
                  views={['hours']} />
              </LocalizationProvider>
            </div>
            <div className="m-0 flex flex-row">
              <button onClick={() => {updateAM(true)}} className={"duration-200 rounded-sm p-4 mr-4 " + (AM ? "bg-[deepskyblue]":"")}>
                AM
              </button>
              <button onClick={() => {updateAM(false)}} className={"duration-200 rounded-sm p-4 " + (!AM ? "bg-[deepskyblue]":"")}>
                PM
              </button>
            </div>
            <div className={"w-full flex flex-col items-center " + (currSelectedHour.Sunday == -1 ? "hidden" : "")}>
              <button onClick={() => handleAvailability(0, "Sunday")} className={"mt-4 w-full p-2 rounded-lg border-2 " + (availabilityIncluded(0, "Sunday") ? "bg-[deepskyblue]":"")}>{time(0, "Sunday")}</button>
              <button onClick={() => handleAvailability(1, "Sunday")} className={"mt-4 w-full p-2 rounded-lg border-2 " + (availabilityIncluded(1, "Sunday") ? "bg-[deepskyblue]":"")}>{time(1, "Sunday")}</button>
            </div>
          </div>
          <div className={"dark:text-primary flex flex-col justify-start items-center w-0 overflow-x-hidden h-fit border-2 border-t-0 p-4 rounded-b-lg flex-grow mr-4 duration-300 " + (activeDay == "Monday" ? "opacity-100" : "opacity-0 pointer-events-none")}>
            <div className="h-48">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimeClock ampm={true} sx={{
                    scale: "0.75",
                    transformOrigin: "top",
                    margin: 0,
                  }} onChange={(value) => {
                    const temp = JSON.parse(JSON.stringify(currSelectedHour));
                    temp.Monday = value.$H;
                    updateCurrSelectedHour(temp);
                  }}
                  views={['hours']} />
              </LocalizationProvider>
            </div>
            <div className="m-0 flex flex-row">
              <button onClick={() => {updateAM(true)}} className={"duration-200 rounded-sm p-4 mr-4 " + (AM ? "bg-[deepskyblue]":"")}>
                AM
              </button>
              <button onClick={() => {updateAM(false)}} className={"duration-200 rounded-sm p-4 " + (!AM ? "bg-[deepskyblue]":"")}>
                PM
              </button>
            </div>
            <div className={"w-full flex flex-col items-center " + (currSelectedHour.Monday == -1 ? "hidden" : "")}>
              <button onClick={() => handleAvailability(0, "Monday")} className={"mt-4 w-full p-2 rounded-lg border-2 " + (availabilityIncluded(0, "Monday") ? "bg-[deepskyblue]":"")}>{time(0, "Monday")}</button>
              <button onClick={() => handleAvailability(1, "Monday")} className={"mt-4 w-full p-2 rounded-lg border-2 " + (availabilityIncluded(1, "Monday") ? "bg-[deepskyblue]":"")}>{time(1, "Monday")}</button>
            </div>
          </div>
          <div className={"dark:text-primary flex flex-col justify-start items-center w-0 overflow-x-hidden h-fit border-2 border-t-0 p-4 rounded-b-lg flex-grow mr-4 duration-300 " + (activeDay == "Tuesday" ? "opacity-100" : "opacity-0 pointer-events-none")}>
            <div className="h-48">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimeClock ampm={true} sx={{
                    scale: "0.75",
                    transformOrigin: "top",
                    margin: 0,
                  }} onChange={(value) => {
                    const temp = JSON.parse(JSON.stringify(currSelectedHour));
                    temp.Tuesday = value.$H;
                    updateCurrSelectedHour(temp);
                  }}
                  views={['hours']} />
              </LocalizationProvider>
            </div>
            <div className="m-0 flex flex-row">
              <button onClick={() => {updateAM(true)}} className={"duration-200 rounded-sm p-4 mr-4 " + (AM ? "bg-[deepskyblue]":"")}>
                AM
              </button>
              <button onClick={() => {updateAM(false)}} className={"duration-200 rounded-sm p-4 " + (!AM ? "bg-[deepskyblue]":"")}>
                PM
              </button>
            </div>
            <div className={"w-full flex flex-col items-center " + (currSelectedHour.Tuesday == -1 ? "hidden" : "")}>
              <button onClick={() => handleAvailability(0, "Tuesday")} className={"mt-4 w-full p-2 rounded-lg border-2 " + (availabilityIncluded(0, "Tuesday") ? "bg-[deepskyblue]":"")}>{time(0, "Tuesday")}</button>
              <button onClick={() => handleAvailability(1, "Tuesday")} className={"mt-4 w-full p-2 rounded-lg border-2 " + (availabilityIncluded(1, "Tuesday") ? "bg-[deepskyblue]":"")}>{time(1, "Tuesday")}</button>
            </div>
          </div>
          <div className={"dark:text-primary flex flex-col justify-start items-center w-0 overflow-x-hidden h-fit border-2 border-t-0 p-4 rounded-b-lg flex-grow mr-4 duration-300 " + (activeDay == "Wednesday" ? "opacity-100" : "opacity-0 pointer-events-none")}>
            <div className="h-48">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimeClock ampm={true} sx={{
                    scale: "0.75",
                    transformOrigin: "top",
                    margin: 0,
                  }} onChange={(value) => {
                    const temp = JSON.parse(JSON.stringify(currSelectedHour));
                    temp.Wednesday = value.$H;
                    updateCurrSelectedHour(temp);
                  }}
                  views={['hours']} />
              </LocalizationProvider>
            </div>
            <div className="m-0 flex flex-row">
              <button onClick={() => {updateAM(true)}} className={"duration-200 rounded-sm p-4 mr-4 " + (AM ? "bg-[deepskyblue]":"")}>
                AM
              </button>
              <button onClick={() => {updateAM(false)}} className={"duration-200 rounded-sm p-4 " + (!AM ? "bg-[deepskyblue]":"")}>
                PM
              </button>
            </div>
            <div className={"w-full flex flex-col items-center " + (currSelectedHour.Wednesday == -1 ? "hidden" : "")}>
              <button onClick={() => handleAvailability(0, "Wednesday")} className={"mt-4 w-full p-2 rounded-lg border-2 " + (availabilityIncluded(0, "Wednesday") ? "bg-[deepskyblue]":"")}>{time(0, "Wednesday")}</button>
              <button onClick={() => handleAvailability(1, "Wednesday")} className={"mt-4 w-full p-2 rounded-lg border-2 " + (availabilityIncluded(1, "Wednesday") ? "bg-[deepskyblue]":"")}>{time(1, "Wednesday")}</button>
            </div>
          </div>
          <div className={"dark:text-primary flex flex-col justify-start items-center w-0 overflow-x-hidden h-fit border-2 border-t-0 p-4 rounded-b-lg flex-grow mr-4 duration-300 " + (activeDay == "Thursday" ? "opacity-100" : "opacity-0 pointer-events-none")}>
            <div className="h-48">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimeClock ampm={true} sx={{
                    scale: "0.75",
                    transformOrigin: "top",
                    margin: 0,
                  }} onChange={(value) => {
                    const temp = JSON.parse(JSON.stringify(currSelectedHour));
                    temp.Thursday = value.$H;
                    updateCurrSelectedHour(temp);
                  }}
                  views={['hours']} />
              </LocalizationProvider>
            </div>
            <div className="m-0 flex flex-row">
              <button onClick={() => {updateAM(true)}} className={"duration-200 rounded-sm p-4 mr-4 " + (AM ? "bg-[deepskyblue]":"")}>
                AM
              </button>
              <button onClick={() => {updateAM(false)}} className={"duration-200 rounded-sm p-4 " + (!AM ? "bg-[deepskyblue]":"")}>
                PM
              </button>
            </div>
            <div className={"w-full flex flex-col items-center " + (currSelectedHour.Thursday == -1 ? "hidden" : "")}>
              <button onClick={() => handleAvailability(0, "Thursday")} className={"mt-4 w-full p-2 rounded-lg border-2 " + (availabilityIncluded(0, "Thursday") ? "bg-[deepskyblue]":"")}>{time(0, "Thursday")}</button>
              <button onClick={() => handleAvailability(1, "Thursday")} className={"mt-4 w-full p-2 rounded-lg border-2 " + (availabilityIncluded(1, "Thursday") ? "bg-[deepskyblue]":"")}>{time(1, "Thursday")}</button>
            </div>
          </div>
          <div className={"dark:text-primary flex flex-col justify-start items-center w-0 overflow-x-hidden h-fit border-2 border-t-0 p-4 rounded-b-lg flex-grow mr-4 duration-300 " + (activeDay == "Friday" ? "opacity-100" : "opacity-0 pointer-events-none")}>
            <div className="h-48">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimeClock ampm={true} sx={{
                    scale: "0.75",
                    transformOrigin: "top",
                    margin: 0,
                  }} onChange={(value) => {
                    const temp = JSON.parse(JSON.stringify(currSelectedHour));
                    temp.Friday = value.$H;
                    updateCurrSelectedHour(temp);
                  }}
                  views={['hours']} />
              </LocalizationProvider>
            </div>
            <div className="m-0 flex flex-row">
              <button onClick={() => {updateAM(true)}} className={"duration-200 rounded-sm p-4 mr-4 " + (AM ? "bg-[deepskyblue]":"")}>
                AM
              </button>
              <button onClick={() => {updateAM(false)}} className={"duration-200 rounded-sm p-4 " + (!AM ? "bg-[deepskyblue]":"")}>
                PM
              </button>
            </div>
            <div className={"w-full flex flex-col items-center " + (currSelectedHour.Friday == -1 ? "hidden" : "")}>
              <button onClick={() => handleAvailability(0, "Friday")} className={"mt-4 w-full p-2 rounded-lg border-2 " + (availabilityIncluded(0, "Friday") ? "bg-[deepskyblue]":"")}>{time(0, "Friday")}</button>
              <button onClick={() => handleAvailability(1, "Friday")} className={"mt-4 w-full p-2 rounded-lg border-2 " + (availabilityIncluded(1, "Friday") ? "bg-[deepskyblue]":"")}>{time(1, "Friday")}</button>
            </div>
          </div>
          <div className={"dark:text-primary flex flex-col justify-start items-center w-0 overflow-x-hidden h-fit border-2 border-t-0 p-4 rounded-b-lg flex-grow duration-300 " + (activeDay == "Saturday" ? "opacity-100" : "opacity-0 pointer-events-none")}>
            <div className="h-48">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimeClock ampm={true} sx={{
                    scale: "0.75",
                    transformOrigin: "top",
                    margin: 0,
                  }} onChange={(value) => {
                    const temp = JSON.parse(JSON.stringify(currSelectedHour));
                    temp.Saturday = value.$H;
                    updateCurrSelectedHour(temp);
                  }}
                  views={['hours']} />
              </LocalizationProvider>
            </div>
            <div className="m-0 flex flex-row">
              <button onClick={() => {updateAM(true)}} className={"duration-200 rounded-sm p-4 mr-4 " + (AM ? "bg-[deepskyblue]":"")}>
                AM
              </button>
              <button onClick={() => {updateAM(false)}} className={"duration-200 rounded-sm p-4 " + (!AM ? "bg-[deepskyblue]":"")}>
                PM
              </button>
            </div>
            <div className={"w-full flex flex-col items-center " + (currSelectedHour.Saturday == -1 ? "hidden" : "")}>
              <button onClick={() => handleAvailability(0, "Saturday")} className={"mt-4 w-full p-2 rounded-lg border-2 " + (availabilityIncluded(0, "Saturday") ? "bg-[deepskyblue]":"")}>{time(0, "Saturday")}</button>
              <button onClick={() => handleAvailability(1, "Saturday")} className={"mt-4 w-full p-2 rounded-lg border-2 " + (availabilityIncluded(1, "Saturday") ? "bg-[deepskyblue]":"")}>{time(1, "Saturday")}</button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row items-center justify-center mb-2">
        <button className="border-2 p-4 w-32 rounded-md mr-6" onClick={saveAvailability}>{saving ? "SAVING...": "SAVE"}</button>
        <button className="border-2 p-4 w-32 rounded-md" onClick={() => {
          updateAvailability({
            "Sunday": [],
            "Monday": [],
            "Tuesday": [],
            "Wednesday": [],
            "Thursday": [],
            "Friday": [],
            "Saturday": [],
          });
        }}>CLEAR</button>
      </div>
    </div>
  )} else {
    return (
      <div className="m-4 bg-[url(/scattered-forcefields5.svg)]bg-cover bg-no-repeat">
        <div className="flex-col w-fit ml-auto mr-auto">
          <div className="w-full border-2 rounded-t-lg">
            <select className="bg-primary text-lg block mr-auto ml-auto" onChange={(change) => updateActiveDay(change.target.value)}>
              <option value="Sunday">Sunday</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
            </select>
          </div>
          <div className={"border-2 border-t-0 rounded-b-lg flex flex-col items-center p-4 duration-0 " + (activeDay == "Sunday" ? "visible" : "hidden pointer-events-none")}>
            <div>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimeClock ampm={true} sx={{
                    margin: 0,
                  }} onChange={(value) => {
                    const temp = JSON.parse(JSON.stringify(currSelectedHour));
                    temp.Sunday = value.$H;
                    updateCurrSelectedHour(temp);
                  }}
                  views={['hours']} />
              </LocalizationProvider>
            </div>
            <div className="m-0 flex flex-row justify-center">
              <button onClick={() => {updateAM(true)}} className={"rounded-sm p-4 mr-4 " + (AM ? "bg-[deepskyblue]":"")}>
                AM
              </button>
              <button onClick={() => {updateAM(false)}} className={"rounded-sm p-4 " + (!AM ? "bg-[deepskyblue]":"")}>
                PM
              </button>
            </div>
            <div className={"w-full flex flex-col items-center " + (currSelectedHour.Sunday == -1 ? "hidden" : "")}>
              <button onClick={() => handleAvailability(0, "Sunday")} className={"mt-4 w-full p-2 rounded-lg border-2 " + (availabilityIncluded(0, "Sunday") ? "bg-[deepskyblue]":"")}>{time(0, "Sunday")}</button>
              <button onClick={() => handleAvailability(1, "Sunday")} className={"mt-4 w-full p-2 rounded-lg border-2 " + (availabilityIncluded(1, "Sunday") ? "bg-[deepskyblue]":"")}>{time(1, "Sunday")}</button>
            </div>
          </div>
          <div className={"border-2 border-t-0 rounded-b-lg flex flex-col items-center p-4 duration-0 " + (activeDay == "Monday" ? "visible" : "hidden pointer-events-none")}>
            <div>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimeClock ampm={true} sx={{
                    margin: 0,
                  }} onChange={(value) => {
                    const temp = JSON.parse(JSON.stringify(currSelectedHour));
                    temp.Monday = value.$H;
                    updateCurrSelectedHour(temp);
                  }}
                  views={['hours']} />
              </LocalizationProvider>
            </div>
            <div className="m-0 flex flex-row justify-center">
              <button onClick={() => {updateAM(true)}} className={"rounded-sm p-4 mr-4 " + (AM ? "bg-[deepskyblue]":"")}>
                AM
              </button>
              <button onClick={() => {updateAM(false)}} className={"rounded-sm p-4 " + (!AM ? "bg-[deepskyblue]":"")}>
                PM
              </button>
            </div>
            <div className={"w-full flex flex-col items-center " + (currSelectedHour.Monday == -1 ? "hidden" : "")}>
              <button onClick={() => handleAvailability(0, "Monday")} className={"mt-4 w-full p-2 rounded-lg border-2 " + (availabilityIncluded(0, "Monday") ? "bg-[deepskyblue]":"")}>{time(0, "Monday")}</button>
              <button onClick={() => handleAvailability(1, "Monday")} className={"mt-4 w-full p-2 rounded-lg border-2 " + (availabilityIncluded(1, "Monday") ? "bg-[deepskyblue]":"")}>{time(1, "Monday")}</button>
            </div>
          </div>
          <div className={"border-2 border-t-0 rounded-b-lg flex flex-col items-center p-4 duration-0 " + (activeDay == "Tuesday" ? "visible" : "hidden pointer-events-none")}>
            <div>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimeClock ampm={true} sx={{
                    margin: 0,
                  }} onChange={(value) => {
                    const temp = JSON.parse(JSON.stringify(currSelectedHour));
                    temp.Tuesday = value.$H;
                    updateCurrSelectedHour(temp);
                  }}
                  views={['hours']} />
              </LocalizationProvider>
            </div>
            <div className="m-0 flex flex-row justify-center">
              <button onClick={() => {updateAM(true)}} className={"rounded-sm p-4 mr-4 " + (AM ? "bg-[deepskyblue]":"")}>
                AM
              </button>
              <button onClick={() => {updateAM(false)}} className={"rounded-sm p-4 " + (!AM ? "bg-[deepskyblue]":"")}>
                PM
              </button>
            </div>
            <div className={"w-full flex flex-col items-center " + (currSelectedHour.Tuesday == -1 ? "hidden" : "")}>
              <button onClick={() => handleAvailability(0, "Tuesday")} className={"mt-4 w-full p-2 rounded-lg border-2 " + (availabilityIncluded(0, "Tuesday") ? "bg-[deepskyblue]":"")}>{time(0, "Tuesday")}</button>
              <button onClick={() => handleAvailability(1, "Tuesday")} className={"mt-4 w-full p-2 rounded-lg border-2 " + (availabilityIncluded(1, "Tuesday") ? "bg-[deepskyblue]":"")}>{time(1, "Tuesday")}</button>
            </div>
          </div>
          <div className={"border-2 border-t-0 rounded-b-lg flex flex-col items-center p-4 duration-0 " + (activeDay == "Wednesday" ? "visible" : "hidden pointer-events-none")}>
            <div>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimeClock ampm={true} sx={{
                    margin: 0,
                  }} onChange={(value) => {
                    const temp = JSON.parse(JSON.stringify(currSelectedHour));
                    temp.Wednesday = value.$H;
                    updateCurrSelectedHour(temp);
                  }}
                  views={['hours']} />
              </LocalizationProvider>
            </div>
            <div className="m-0 flex flex-row justify-center">
              <button onClick={() => {updateAM(true)}} className={"rounded-sm p-4 mr-4 " + (AM ? "bg-[deepskyblue]":"")}>
                AM
              </button>
              <button onClick={() => {updateAM(false)}} className={"rounded-sm p-4 " + (!AM ? "bg-[deepskyblue]":"")}>
                PM
              </button>
            </div>
            <div className={"w-full flex flex-col items-center " + (currSelectedHour.Wednesday == -1 ? "hidden" : "")}>
              <button onClick={() => handleAvailability(0, "Wednesday")} className={"mt-4 w-full p-2 rounded-lg border-2 " + (availabilityIncluded(0, "Wednesday") ? "bg-[deepskyblue]":"")}>{time(0, "Wednesday")}</button>
              <button onClick={() => handleAvailability(1, "Wednesday")} className={"mt-4 w-full p-2 rounded-lg border-2 " + (availabilityIncluded(1, "Wednesday") ? "bg-[deepskyblue]":"")}>{time(1, "Wednesday")}</button>
            </div>
          </div>
          <div className={"border-2 border-t-0 rounded-b-lg flex flex-col items-center p-4 duration-0 " + (activeDay == "Thursday" ? "visible" : "hidden pointer-events-none")}>
            <div>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimeClock ampm={true} sx={{
                    margin: 0,
                  }} onChange={(value) => {
                    const temp = JSON.parse(JSON.stringify(currSelectedHour));
                    temp.Thursday = value.$H;
                    updateCurrSelectedHour(temp);
                  }}
                  views={['hours']} />
              </LocalizationProvider>
            </div>
            <div className="m-0 flex flex-row justify-center">
              <button onClick={() => {updateAM(true)}} className={"rounded-sm p-4 mr-4 " + (AM ? "bg-[deepskyblue]":"")}>
                AM
              </button>
              <button onClick={() => {updateAM(false)}} className={"rounded-sm p-4 " + (!AM ? "bg-[deepskyblue]":"")}>
                PM
              </button>
            </div>
            <div className={"w-full flex flex-col items-center " + (currSelectedHour.Thursday == -1 ? "hidden" : "")}>
              <button onClick={() => handleAvailability(0, "Thursday")} className={"mt-4 w-full p-2 rounded-lg border-2 " + (availabilityIncluded(0, "Thursday") ? "bg-[deepskyblue]":"")}>{time(0, "Thursday")}</button>
              <button onClick={() => handleAvailability(1, "Thursday")} className={"mt-4 w-full p-2 rounded-lg border-2 " + (availabilityIncluded(1, "Thursday") ? "bg-[deepskyblue]":"")}>{time(1, "Thursday")}</button>
            </div>
          </div>
          <div className={"border-2 border-t-0 rounded-b-lg flex flex-col items-center p-4 duration-0 " + (activeDay == "Friday" ? "visible" : "hidden pointer-events-none")}>
            <div>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimeClock ampm={true} sx={{
                    margin: 0,
                  }} onChange={(value) => {
                    const temp = JSON.parse(JSON.stringify(currSelectedHour));
                    temp.Friday = value.$H;
                    updateCurrSelectedHour(temp);
                  }}
                  views={['hours']} />
              </LocalizationProvider>
            </div>
            <div className="m-0 flex flex-row justify-center">
              <button onClick={() => {updateAM(true)}} className={"rounded-sm p-4 mr-4 " + (AM ? "bg-[deepskyblue]":"")}>
                AM
              </button>
              <button onClick={() => {updateAM(false)}} className={"rounded-sm p-4 " + (!AM ? "bg-[deepskyblue]":"")}>
                PM
              </button>
            </div>
            <div className={"w-full flex flex-col items-center " + (currSelectedHour.Friday == -1 ? "hidden" : "")}>
              <button onClick={() => handleAvailability(0, "Friday")} className={"mt-4 w-full p-2 rounded-lg border-2 " + (availabilityIncluded(0, "Friday") ? "bg-[deepskyblue]":"")}>{time(0, "Friday")}</button>
              <button onClick={() => handleAvailability(1, "Friday")} className={"mt-4 w-full p-2 rounded-lg border-2 " + (availabilityIncluded(1, "Friday") ? "bg-[deepskyblue]":"")}>{time(1, "Friday")}</button>
            </div>
          </div>
          <div className={"border-2 border-t-0 rounded-b-lg flex flex-col items-center p-4 duration-0 " + (activeDay == "Saturday" ? "visible" : "hidden pointer-events-none")}>
            <div>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimeClock ampm={true} sx={{
                    margin: 0,
                  }} onChange={(value) => {
                    const temp = JSON.parse(JSON.stringify(currSelectedHour));
                    temp.Saturday = value.$H;
                    updateCurrSelectedHour(temp);
                  }}
                  views={['hours']} />
              </LocalizationProvider>
            </div>
            <div className="m-0 flex flex-row justify-center">
              <button onClick={() => {updateAM(true)}} className={"rounded-sm p-4 mr-4 " + (AM ? "bg-[deepskyblue]":"")}>
                AM
              </button>
              <button onClick={() => {updateAM(false)}} className={"rounded-sm p-4 " + (!AM ? "bg-[deepskyblue]":"")}>
                PM
              </button>
            </div>
            <div className={"w-full flex flex-col items-center " + (currSelectedHour.Saturday == -1 ? "hidden" : "")}>
              <button onClick={() => handleAvailability(0, "Saturday")} className={"mt-4 w-full p-2 rounded-lg border-2 " + (availabilityIncluded(0, "Saturday") ? "bg-[deepskyblue]":"")}>{time(0, "Saturday")}</button>
              <button onClick={() => handleAvailability(1, "Saturday")} className={"mt-4 w-full p-2 rounded-lg border-2 " + (availabilityIncluded(1, "Saturday") ? "bg-[deepskyblue]":"")}>{time(1, "Saturday")}</button>
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center justify-center mb-2 mt-8">
          <button className="border-2 p-4 w-32 rounded-md mr-6" onClick={saveAvailability}>{saving ? "SAVING...": "SAVE"}</button>
          <button className="border-2 p-4 w-32 rounded-md" onClick={() => {
            updateAvailability({
              "Sunday": [],
              "Monday": [],
              "Tuesday": [],
              "Wednesday": [],
              "Thursday": [],
              "Friday": [],
              "Saturday": [],
            });
          }}>CLEAR</button>
        </div>
      </div>
    )
  }
}