'use client'
import Footer from "@/components/Footer";
import { MobileContext } from "@/contexts/MobileContext";
import { UserDataContext } from "@/contexts/UserContext";
import { useContext, useEffect, useState } from "react";
import tutors from '../../../data/tutor_data.json'
import { TutorData } from "@/types/tutordata";
import Loading from "@/components/Loading";
import { LocalizationProvider, TimeClock } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { WeeklyAvailability } from "@/types/weeklyAvailability";

export default function Weekly(){
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

  type Weekday = "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";

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


  function time(slot: number, day: Weekday){
    const h = currSelectedHour[day] + (currSelectedHour[day] == 0 ? 12 : 0);
    let m = "00";
    switch(slot){
      case 0:
        m = "00";
        break;
      case 1:
        m = "15";
        break;
      case 2:
        m = "30";
        break;
      case 3:
        m = "45";
        break;
    }
    return h.toString() + ":" + m + " " + (AM ? "AM" : "PM");
  }

  function availabiltyIncluded(slot: number, day: Weekday){
    return availabilty[day].includes(time(slot, day));
  }

  function handleAvailability(slot: number, day: Weekday){
    if(activeDay == "") return;
    const str = time(slot, day);
    const temp = JSON.parse(JSON.stringify(availabilty));
    if(availabiltyIncluded(slot, day)){
      temp[activeDay].splice(availabilty[activeDay].indexOf(str), 1);
    } else {
      temp[activeDay].push(str);
    }
    updateAvailability(temp)
    console.log(temp);
  }

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
  // general idea: lots of collapsables, so one dropdown for each day, then a dropdown for each hour, then buttons for each 15-minute block
  if(!isMobile)
  return (
    <main className="flex flex-col justify-between h-[calc(100%-5rem)] bg-[right_35%] bg-[url(/scattered-forcefields5.svg)] dark:bg-[url(/scattered-forcefields5-dark.svg)] bg-cover bg-no-repeat">
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
              <button onClick={() => handleAvailability(0, "Sunday")} className={"mt-4 w-full p-2 rounded-lg border-2 " + (availabiltyIncluded(0, "Sunday") ? "bg-[deepskyblue]":"")}>{time(0, "Sunday")}</button>
              <button onClick={() => handleAvailability(1, "Sunday")} className={"mt-4 w-full p-2 rounded-lg border-2 " + (availabiltyIncluded(1, "Sunday") ? "bg-[deepskyblue]":"")}>{time(1, "Sunday")}</button>
              <button onClick={() => handleAvailability(2, "Sunday")} className={"mt-4 w-full p-2 rounded-lg border-2 " + (availabiltyIncluded(2, "Sunday") ? "bg-[deepskyblue]":"")}>{time(2, "Sunday")}</button>
              <button onClick={() => handleAvailability(3, "Sunday")} className={"mt-4 w-full p-2 rounded-lg border-2 " + (availabiltyIncluded(3, "Sunday") ? "bg-[deepskyblue]":"")}>{time(3, "Sunday")}</button>
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
              <button onClick={() => handleAvailability(0, "Monday")} className={"mt-4 w-full p-2 rounded-lg border-2 " + (availabiltyIncluded(0, "Monday") ? "bg-[deepskyblue]":"")}>{time(0, "Monday")}</button>
              <button onClick={() => handleAvailability(1, "Monday")} className={"mt-4 w-full p-2 rounded-lg border-2 " + (availabiltyIncluded(1, "Monday") ? "bg-[deepskyblue]":"")}>{time(1, "Monday")}</button>
              <button onClick={() => handleAvailability(2, "Monday")} className={"mt-4 w-full p-2 rounded-lg border-2 " + (availabiltyIncluded(2, "Monday") ? "bg-[deepskyblue]":"")}>{time(2, "Monday")}</button>
              <button onClick={() => handleAvailability(3, "Monday")} className={"mt-4 w-full p-2 rounded-lg border-2 " + (availabiltyIncluded(3, "Monday") ? "bg-[deepskyblue]":"")}>{time(3, "Monday")}</button>
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
              <button onClick={() => handleAvailability(0, "Tuesday")} className={"mt-4 w-full p-2 rounded-lg border-2 " + (availabiltyIncluded(0, "Tuesday") ? "bg-[deepskyblue]":"")}>{time(0, "Tuesday")}</button>
              <button onClick={() => handleAvailability(1, "Tuesday")} className={"mt-4 w-full p-2 rounded-lg border-2 " + (availabiltyIncluded(1, "Tuesday") ? "bg-[deepskyblue]":"")}>{time(1, "Tuesday")}</button>
              <button onClick={() => handleAvailability(2, "Tuesday")} className={"mt-4 w-full p-2 rounded-lg border-2 " + (availabiltyIncluded(2, "Tuesday") ? "bg-[deepskyblue]":"")}>{time(2, "Tuesday")}</button>
              <button onClick={() => handleAvailability(3, "Tuesday")} className={"mt-4 w-full p-2 rounded-lg border-2 " + (availabiltyIncluded(3, "Tuesday") ? "bg-[deepskyblue]":"")}>{time(3, "Tuesday")}</button>
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
              <button onClick={() => handleAvailability(0, "Wednesday")} className={"mt-4 w-full p-2 rounded-lg border-2 " + (availabiltyIncluded(0, "Wednesday") ? "bg-[deepskyblue]":"")}>{time(0, "Wednesday")}</button>
              <button onClick={() => handleAvailability(1, "Wednesday")} className={"mt-4 w-full p-2 rounded-lg border-2 " + (availabiltyIncluded(1, "Wednesday") ? "bg-[deepskyblue]":"")}>{time(1, "Wednesday")}</button>
              <button onClick={() => handleAvailability(2, "Wednesday")} className={"mt-4 w-full p-2 rounded-lg border-2 " + (availabiltyIncluded(2, "Wednesday") ? "bg-[deepskyblue]":"")}>{time(2, "Wednesday")}</button>
              <button onClick={() => handleAvailability(3, "Wednesday")} className={"mt-4 w-full p-2 rounded-lg border-2 " + (availabiltyIncluded(3, "Wednesday") ? "bg-[deepskyblue]":"")}>{time(3, "Wednesday")}</button>
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
              <button onClick={() => handleAvailability(0, "Thursday")} className={"mt-4 w-full p-2 rounded-lg border-2 " + (availabiltyIncluded(0, "Thursday") ? "bg-[deepskyblue]":"")}>{time(0, "Thursday")}</button>
              <button onClick={() => handleAvailability(1, "Thursday")} className={"mt-4 w-full p-2 rounded-lg border-2 " + (availabiltyIncluded(1, "Thursday") ? "bg-[deepskyblue]":"")}>{time(1, "Thursday")}</button>
              <button onClick={() => handleAvailability(2, "Thursday")} className={"mt-4 w-full p-2 rounded-lg border-2 " + (availabiltyIncluded(2, "Thursday") ? "bg-[deepskyblue]":"")}>{time(2, "Thursday")}</button>
              <button onClick={() => handleAvailability(3, "Thursday")} className={"mt-4 w-full p-2 rounded-lg border-2 " + (availabiltyIncluded(3, "Thursday") ? "bg-[deepskyblue]":"")}>{time(3, "Thursday")}</button>
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
              <button onClick={() => handleAvailability(0, "Friday")} className={"mt-4 w-full p-2 rounded-lg border-2 " + (availabiltyIncluded(0, "Friday") ? "bg-[deepskyblue]":"")}>{time(0, "Friday")}</button>
              <button onClick={() => handleAvailability(1, "Friday")} className={"mt-4 w-full p-2 rounded-lg border-2 " + (availabiltyIncluded(1, "Friday") ? "bg-[deepskyblue]":"")}>{time(1, "Friday")}</button>
              <button onClick={() => handleAvailability(2, "Friday")} className={"mt-4 w-full p-2 rounded-lg border-2 " + (availabiltyIncluded(2, "Friday") ? "bg-[deepskyblue]":"")}>{time(2, "Friday")}</button>
              <button onClick={() => handleAvailability(3, "Friday")} className={"mt-4 w-full p-2 rounded-lg border-2 " + (availabiltyIncluded(3, "Friday") ? "bg-[deepskyblue]":"")}>{time(3, "Friday")}</button>
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
              <button onClick={() => handleAvailability(0, "Saturday")} className={"mt-4 w-full p-2 rounded-lg border-2 " + (availabiltyIncluded(0, "Saturday") ? "bg-[deepskyblue]":"")}>{time(0, "Saturday")}</button>
              <button onClick={() => handleAvailability(1, "Saturday")} className={"mt-4 w-full p-2 rounded-lg border-2 " + (availabiltyIncluded(1, "Saturday") ? "bg-[deepskyblue]":"")}>{time(1, "Saturday")}</button>
              <button onClick={() => handleAvailability(2, "Saturday")} className={"mt-4 w-full p-2 rounded-lg border-2 " + (availabiltyIncluded(2, "Saturday") ? "bg-[deepskyblue]":"")}>{time(2, "Saturday")}</button>
              <button onClick={() => handleAvailability(3, "Saturday")} className={"mt-4 w-full p-2 rounded-lg border-2 " + (availabiltyIncluded(3, "Saturday") ? "bg-[deepskyblue]":"")}>{time(3, "Saturday")}</button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}