'use client'
import './page.css'
import { TutorData } from '@/types/tutordata'
import tutors from '../../../public/tutor_data.json'
import { useCallback, useContext, useEffect, useState } from 'react'
import Loading from '@/components/Loading';
import Calendar from 'react-calendar'
import { MobileContext } from '@/contexts/MobileContext'
import { addDoc, collection, doc, onSnapshot, setDoc } from 'firebase/firestore'
import { FirebaseFirestoreContext } from '@/contexts/FirebaseContext'
import { WeeklyAvailability } from '@/types/weeklyAvailability'
import { UserDataContext } from '@/contexts/UserContext'
import Popup from 'reactjs-popup'

export default function TutorPage({params}){
  const isMobile = useContext(MobileContext);
  const user = useContext(UserDataContext);
  const [tutor, updateTutor] = useState<TutorData>();
  const [tutorExists, updateTutorExists] = useState(true);
  const [courses, updateCourses] = useState([<></>]);

  const dataNameToText = {
    mathcore: "Math Courses(Core)",
    moreMath: "Math Courses(Non-Core)",
    physics: "Physics Courses",
    biology: "Biology Courses",
    chemistry: "Chemistry Courses",
    cs: "CS Courses",
    language: "Language Courses",
    otherScience: "Other Science Courses"
  };
  // Sorts the class list by their length 
  const sortTutorSubjects = useCallback(() => {
    if(!tutor) return;
    const temp = JSON.parse(JSON.stringify(tutor));
    delete temp['lastName'];
    delete temp['firstName'];
    delete temp['id'];
    delete temp['graduationYear'];
    delete temp['emailAddress'];
    delete temp['wing'];
    delete temp['hall'];
    delete temp['aboutMe'];

    const sorted = Object.keys(temp).map((key) => [key, temp[key]]);
    sorted.sort((a, b) => {
      if(!a[1]) return 1;
      if(!b[1]) return -1;
      return b[1].length - a[1].length;
    });

    const ans = sorted.map((element) => {
      if(element[1]){
        return(
          <div className = "courses" key={element[0]}>
            <h3 id = "labelUnder">{dataNameToText[element[0]]}</h3>
            <div className="courses">
              {element[1].map((course) => {
                return <ul key={course}>{course}</ul>
              })}
            </div>
          </div>
        );
      } else return (<></>)
    });
    if(ans) updateCourses(ans);
  }, [tutor, dataNameToText]);

  useEffect(() => {
    let exists = false;
    tutors.forEach((tutor: TutorData) => {
      if(String(tutor.id) == params.id) {
        updateTutor(tutor);
        exists = true;
      }
    });
    updateTutorExists(exists);
    sortTutorSubjects();
  }, [tutor])


  const [day, updateDay] = useState<Date>(new Date());

  const [weeklyAvailabilty, updateWeeklyAvailability] = useState<WeeklyAvailability>({
    "Sunday": [],
    "Monday": [],
    "Tuesday": [],
    "Wednesday": [],
    "Thursday": [],
    "Friday": [],
    "Saturday": [],
  });

  const db = useContext(FirebaseFirestoreContext);
  const [changes, updateChanges] = useState({});

  

  useEffect(() => {
    const getData = async () => {
      if(!tutor || !tutor.id) return;
      const tutorRef = doc(db, 'tutors', String(tutor.id));
      onSnapshot(tutorRef, (doc) => {
        let d = doc.data();
        if(doc.get('weekly')){
          updateWeeklyAvailability(doc.get('weekly'));
          delete d['weekly'];
        }
        if(d){
          updateChanges(d);
        }
      });
    }
    getData();
  }, [tutor, db])

  const [slotsContainer, updateSlotsContainer] = useState(<></>);

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

  function dateToDay(date: Date){
    return date.toLocaleString("en-US").split(",").at(0);
  }

  const [slot, updateSlot] = useState(["" , ""]);

  function value(time: string){
    time = time.replace(":", " ");
    const parts = time.split(' ');
    let val = parseInt(parts[0]) * 100;
    if(parts[0] == "12") val -= 1200;
    if(parts[1].slice(2, 4) == "PM") val += 1200;
    val += parseInt(parts[1].slice(0, 2));
    return val;
  }

  useEffect(() => {
    const w = numToWeekday(day);
    const d = dateToDay(day);
    if(user[1]){
      updateSlotsContainer(
        <div className={(isMobile ? "h-full w-1/2": "h-0 flex-grow") + ' border-2 border-[rgb(203,_213,_224)] dark:border-[white] p-2 flex flex-row items-center'}>
          <p className='text-center w-full'>Loading...</p>
        </div>
      )
      return;
    }
    if(!user[0]){
      updateSlotsContainer(
        <div className={(isMobile ? "h-full w-1/2": "h-0 flex-grow") + ' h-0 border-2 border-[rgb(203,_213,_224)] dark:border-[white] p-2 flex flex-row items-center'}>
          <p className='text-center w-full'>Please Sign In With Your IMSA email</p>
        </div>
      )
      return;
    }
    let slots = [];
    weeklyAvailabilty[w].forEach((value) => {
      if(!(changes.hasOwnProperty(d) && (changes[d].changes.includes(value) || changes[d].booked.includes(value)))) slots.push(value);
    });
    if(changes.hasOwnProperty(d)){
      changes[d].changes.forEach((value) => {
        if(!weeklyAvailabilty[w].includes(value) && !changes[d].booked.includes(value)){
          slots.push(value);
        }
      })
    }
    slots.sort((a, b) => {
      return value(a) - value(b);
    })
    if(slots.length > 0){
      updateSlotsContainer(
        <div id="slots" className={(isMobile ? "h-full w-1/2": "h-0 flex-grow") + ' border-2 border-[rgb(203,_213,_224)] dark:border-[white] p-4 overflow-y-auto'}>
          {slots.map((value) => {
            const s = [d, value];
            return <button key={value} onClick={() => {updateSlot(s)}} className={"mb-4 w-full p-2 rounded-lg border-2 last:mb-0 " + ((JSON.stringify(slot) == JSON.stringify([d, value])) ? "bg-[deepskyblue]": "")}>{value}</button>
          })}
        </div>
      )
    }
    else {
      updateSlotsContainer(
        <div className={(isMobile ? "h-full w-1/2": "h-0 flex-grow") + ' border-2 border-[rgb(203,_213,_224)] dark:border-[white] p-2 flex flex-row items-center'}>
          <p className='text-center w-full'>The tutor is not available today.</p>
        </div>
      )
    }
  }, [weeklyAvailabilty, changes, day, slot, user, isMobile])

  useEffect(() => {
    updateSlot(["", ""]);
  }, [day])

  const [booking, updateBooking] = useState(false);
  const [error, updateError] = useState(false);

  const [popupOpen, updatePopupOpen] = useState(false);

  async function book(){
    if(!user[0]){
      updatePopupOpen(true);
      return;
    }
    if(slot[0] == "") return;
    if(!tutor || !tutor.id) {
      alert("This tutor doesn't exist?");
      return;
    }
    const tutorRef = doc(db, 'tutors', String(tutor.id));
    updateError(false);
    updateBooking(true);
    let booked = [slot[1]];
    if(changes.hasOwnProperty(slot[0])){
      booked = booked.concat(changes[slot[0]].booked);
    }
    let error = false;
    const c = ((changes.hasOwnProperty(slot[0]) && changes[slot[0]].hasOwnProperty("changes")) ? changes[slot[0]].changes : []);
    await setDoc(tutorRef, {[slot[0]] : {
      booked: booked,
      changes: c
    }}, { merge: true }).catch(() => {
      updateError(true);
      error = true;
    }).then(() => {
      if(error) {
        updateBooking(false);
        updateSlot(["", ""])
        return;
      }
    });

    
    const studentRef = doc(db, 'bookings', user[0].uid);
    const fullTime = slot[0] + " " + slot[1];
    await setDoc(studentRef, {
      [fullTime]: tutor.id 
    }, { merge: true }).catch(() => {
      updateError(true);
      error = true;
    }).then(() => {
      if(error) {
        updateBooking(false);
        updateSlot(["", ""])
        return;
      }
    });

    let info = "";
    const info_element = (document.getElementById("info") as HTMLTextAreaElement);
    if(info_element) info = info_element.value;
    await addDoc(collection(db, "mail"), {
      to: tutor.emailAddress,
      cc: user[0].email,
      template: {
        name: "Booked",
        data: {
          name: user[0].displayName,
          tutor: tutor.firstName,
          time: slot[1],
          day: slot[0],
          info: info
        },
      },
    }).catch(() => {
      updateError(true);
    }).then(() => {
      updateBooking(false);
      updateSlot(["", ""]);
      info_element.value = "";
    });
  }


  if(!tutorExists){
    window.location.replace("/tutors");
  }

  const bookingSection =
  <div className = {"h-fit " + (isMobile ? "mt-4": "ml-4")}>
    {isMobile ? 
      <div className='flex flex-col w-[325px]'>
        <Calendar minDate={new Date()} className="w-[350px]" locale="en-US" minDetail="month" defaultValue={new Date()} onChange={(val) => updateDay(new Date(val))} />
        <div className='flex flex-row mt-4 h-[200px] w-full'>
          {slotsContainer}
          <textarea id='info' className='rounded-none ml-2 flex-grow resize-none border-2 h-full p-2 border-[rgb(203,_213,_224)] dark:border-[white] bg-primary dark:bg-primary-dark' placeholder='Additional Notes (optional)'></textarea>
        </div>
        <button onClick={book} className={'mb-4 w-full duration-300 rounded-md mt-2 p-2 font-bold text-[white] ' + (error ? "bg-[red]":(slot[0] == "" ? "bg-[grey]" : "bg-[deepskyblue] hover:bg-[#00afef]"))}>{error ? "Error" : (booking ? "Booking..." : "BOOK")}</button>
      </div>
    :
      <div className='flex flex-col'>
        <div className={"flex flex-row items-stretch"}>
          <Calendar minDate={new Date()} className="w-[500px]" locale="en-US" minDetail="month" defaultValue={new Date()} onChange={(val) => updateDay(new Date(val))} />
          <div className={'flex flex-col justify-between ml-4 w-40 ' + (isMobile ? "w-full mt-4" : "ml-4 w-40")}>
            {slotsContainer}
            <textarea id='info' className='flex-grow-0 resize-none border-2 mt-2 h-24 p-2 border-[rgb(203,_213,_224)] dark:border-[white] bg-primary dark:bg-primary-dark' placeholder='Additional Notes (optional)'></textarea>
          </div>
        </div>
        <button onClick={book} className={'duration-300 rounded-md mt-2 p-2 font-bold text-[white] ' + (error ? "bg-[red]":(slot[0] == "" ? "bg-[grey]" : "bg-[deepskyblue] hover:bg-[#00afef]"))}>{error ? "Error" : (booking ? "Booking..." : "BOOK")}</button>
      </div>
    }
  </div>

  if(!tutor) return <Loading />
  return (
    <div className='flex flex-col justify-between w-full'>
      <Popup
        open={popupOpen}
        modal
        onClose={() => updatePopupOpen(false)}
        closeOnDocumentClick
      >
        <div className="modal flex flex-col justify-center bg-primary dark:bg-primary-dark border-2 rounded-lg">
          <div className="text-center p-0 text-3xl">
            Please Sign in With Your IMSA Email
          </div>
        </div>
      </Popup>
      <div className='mr-8'>
        <h2> {tutor.firstName + " " + tutor.lastName} </h2>
        <div className = "mainTextArea h-fit">
          <div className = {"publicProfile items-stretch " + (isMobile ? "flex-col !mt-4" : "flex-row")}>
            <div id="sign-up-form">
              <div className='mb-4'>
                <h3 id="label">About Me:</h3>
                <p className='mt-2'>{tutor.aboutMe}</p>
              </div>
              <div>
                <h3 id = "label">Classes I Tutor:</h3>
                <div className = "tutorCourses mt-2">
                  {courses}
                </div>
              </div>
              <div id = "twotable">
                <div>                    
                  <h3 id = "label">Hall:</h3>
                  <p className = "hallNumber">{tutor.hall}</p>
                </div>
                <div>                    
                  <h3 id = "label">Wing:</h3>
                  <p className = "hallNumber">{tutor.wing}</p>
                </div>                  
                </div>
            </div>
            {bookingSection}
          </div>
        </div> 
      </div>
    </div>
  )
}