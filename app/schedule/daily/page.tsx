'use client'
import { FirebaseFirestoreContext } from "@/contexts/FirebaseContext";
import { MobileContext } from "@/contexts/MobileContext";
import { UserDataContext } from "@/contexts/UserContext";
import { TutorData } from "@/types/tutordata";
import { useContext, useEffect, useState } from "react";
import tutors from '../../../data/tutor_data.json'
import { WeeklyAvailability } from "@/types/weeklyAvailability";
import { DocumentSnapshot, doc, getDoc, setDoc } from "firebase/firestore";
import Loading from "@/components/Loading";
import './page.css'
import Calendar from "react-calendar";
import Footer from "@/components/Footer";
import { LocalizationProvider, TimeClock } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function Daily(){
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

    const name = user[0].displayName.split(" ");
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

  

  const [day, updateDay] = useState(new Date());
  const [AM, updateAM] = useState(true);
  const [currSelectedHour, updateCurrSelectedHour] = useState(-1);

  const [weeklyAvailabilty, updateWeeklyAvailability] = useState<WeeklyAvailability>({
    "Sunday": [],
    "Monday": [],
    "Tuesday": [],
    "Wednesday": [],
    "Thursday": [],
    "Friday": [],
    "Saturday": [],
  });

  const [changes, updateChanges] = useState({});

  const [availabilty, updateAvailability] = useState<DocumentSnapshot>();

  function time(slot: number){
    const h = currSelectedHour + (currSelectedHour == 0 ? 12 : 0);
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

  const getData = async () =>{
      if(!tutor || !tutor.id) return;
      const tutorRef = doc(db, 'tutors', tutor.id);
      await getDoc(tutorRef).then((res) => {
        const d = res.data();
        if(res.get('weekly')){
          updateWeeklyAvailability(res.get('weekly'));
          delete d['weekly'];
        }
        updateChanges(d);
      })
    }
  
  useEffect(() => {  
    getData();
  }, [tutor])

  function dateToDay(date: Date){
    return date.toLocaleString("en-US").split(",").at(0);
  }

  useEffect(() => {
    updateDay(new Date());
  }, [])

  function handleAvailability(slot: number){
    const t = time(slot);
    let temp = JSON.parse(JSON.stringify(changes));
    const d = dateToDay(day);
    if(!changes.hasOwnProperty(d)){
      temp[d] = [];
    }
    if(temp[d].includes(t)){
      temp[d].splice(temp[d].indexOf(t), 1);
      if(temp[d].length == 0){
        delete temp[d];
      }
    } else {
      temp[d].push(t);
    }
    updateChanges(temp);
    console.log(temp);
  }

  function numToWeekday(date: Date){
    const day = date.getDay();
    switch(day){
      case 0: 
        return "Sunday";
      case 1: 
        return "Monday";
      case 2: 
        return "Tuesday";
      case 3:
        return "Wednesday";
      case 4:
        return "Thursday";
      case 5:
        return "Friday";
      case 6:
        return "Saturday";
    }
    return "Monday"
  }

  function getColor(slot: number){
    const t = time(slot);
    const d = dateToDay(day);
    if(weeklyAvailabilty[numToWeekday(day)].includes(t)){
      if(changes.hasOwnProperty(d) && changes[d].includes(t)){
        console.log("here");
        return "bg-[red]"
      } else {
        return "bg-[deepskyblue]"
      }
    } else {
      if(changes.hasOwnProperty(d) && changes[d].includes(t)){
        return "bg-[green]"
      } else {
        return "bg-none"
      }
    }
  }

  const [saving, updateSaving] = useState(false);

  async function saveAvailability(){
    if(!tutor || !tutor.id){
      alert("Error! Are you signed in?");
      return;
    }
    const tutorRef = doc(db, 'tutors', tutor.id);
    updateSaving(true);
    await setDoc(tutorRef, {...changes, weekly: weeklyAvailabilty}, { merge: false }).catch(() => {
      alert("There's been an error. Please try again.");
    }).then(() => {
      updateSaving(false);
    });
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

  if(!tutorExists){
    return (
      <main className="flex items-center justify-center text-center text-lg h-[calc(100%-5rem)] bg-[url(/scattered-forcefields5.svg)] dark:bg-[url(/scattered-forcefields5-dark.svg)] bg-cover bg-no-repeat">
        Hmm, you don't seem to be registered as a peer tutor. <br /> If you are, please fill out the help form.
      </main>
    )
  }

  return (
    <main className="flex flex-col h-[calc(100%-5rem)]">
      <div className="flex flex-col flex-grow justify-between">
        <div className="flex flex-row flex-grow w-full justify-center items-center p-4">
          <div className="mr-16">
            <Calendar locale="en-US" minDetail="month" defaultValue={new Date()} onChange={(val) => updateDay(new Date(val))} />
          </div>
          <div className="dark:text-primary flex flex-col justify-start items-center overflow-x-hidden h-fit border-2 p-4 rounded-lg ">
              <div>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimeClock ampm={true} sx={{
                    }} onChange={(value) => {
                      updateCurrSelectedHour(value.$H);
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
              <div className={"w-full flex flex-col items-center " + (currSelectedHour == -1 ? "hidden" : "")}>
                <button onClick={() => handleAvailability(0)} className={"mt-4 w-full p-2 rounded-lg border-2 " + getColor(0)}>{time(0)}</button>
                <button onClick={() => handleAvailability(1)} className={"mt-4 w-full p-2 rounded-lg border-2 " + getColor(1)}>{time(1)}</button>
                <button onClick={() => handleAvailability(2)} className={"mt-4 w-full p-2 rounded-lg border-2 " + getColor(2)}>{time(2)}</button>
                <button onClick={() => handleAvailability(3)} className={"mt-4 w-full p-2 rounded-lg border-2 " + getColor(3)}>{time(3)}</button>
              </div>
            </div>
        </div>
        <div className="flex flex-row items-center justify-center mb-2">
          <button className="border-2 p-4 w-32 rounded-md mr-6" onClick={saveAvailability}>{saving ? "SAVING...": "SAVE"}</button>
          <button className="border-2 p-4 w-32 rounded-md" onClick={getData}>RESET</button>
        </div>
      </div>
      {isMobile ? <></> : <Footer />}
    </main>
  )
}