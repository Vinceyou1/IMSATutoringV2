'use client'
import './page.css'
import { TutorData } from '@/types/tutordata'
import tutors from '../../../data/tutor_data.json'
import { useContext, useEffect, useState } from 'react'
import Loading from '@/components/Loading';
import Calendar from 'react-calendar'
import { MobileContext } from '@/contexts/MobileContext'
import Footer from '@/components/Footer'
import { doc, getDoc } from 'firebase/firestore'
import { FirebaseFirestoreContext } from '@/contexts/FirebaseContext'
import { WeeklyAvailability } from '@/types/weeklyAvailability'

export default function TutorPage({params}){
  const isMobile = useContext(MobileContext);
  const [tutor, updateTutor] = useState<TutorData>();
  const [tutorExists, updateTutorExists] = useState(true);
  const [courses, updateCourses] = useState([<></>]);
  useEffect(() => {
    let exists = false;
    tutors.forEach((tutor: TutorData) => {
      if(tutor.id == params.id) {
        updateTutor(tutor);
        exists = true;
      }
    });
    updateTutorExists(exists);
    sortTutorSubjects();
  }, [tutor])

  const dataNameToText = {
    "math_courses": "Math Courses",
    physics_courses: "Physics Courses",
    bio_courses: "Biology Courses",
    chem_course: "Chemistry Courses",
    cs_courses: "CS Courses",
    language_courses: "Language Courses",
    other_courses: "Other Science Courses"
  }

  // Sorts the class list by their length 
  function sortTutorSubjects(){
    if(!tutor) return;
    const temp = JSON.parse(JSON.stringify(tutor));
    delete temp['last_name'];
    delete temp['first_name'];
    delete temp['id'];
    delete temp['year'];

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
                return <ul>{course}</ul>
              })}
            </div>
          </div>
        );
      } else return (<></>)
    });
    if(ans) updateCourses(ans);
  }

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
    time = time.replace(":", "");
    const parts = time.split(' ');
    let val = parseInt(parts[0]);
    if(parts[0].slice(0, 2) == "12") val -= 1200;
    if(parts[1] == "PM") val += 1200;
    return val;
  }

  useEffect(() => {
    const w = numToWeekday(day);
    const d = dateToDay(day);
    if(weeklyAvailabilty[w].length == 0 && !changes.hasOwnProperty(d)){
      updateSlotsContainer(
        <div className='border-2 border-[rgb(203,_213,_224)] dark:border-[white] flex-grow p-2 flex flex-row items-center'>
          <p className='text-center'>The tutor is not available today.</p>
        </div>
      )
    } else {
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
      console.log(slots);
      updateSlotsContainer(
        <div className='border-2 border-[rgb(203,_213,_224)] dark:border-[white] flex-grow p-4 overflow-y-auto'>
          {slots.map((value) => {
            const s = [d, value];
            console.log(s);
            return <button onClick={() => {updateSlot(s)}} className={"mb-4 w-full p-2 rounded-lg border-2 last:mb-0 " + ((JSON.stringify(slot) == JSON.stringify([d, value])) ? "bg-[deepskyblue]": "")}>{value}</button>
          })}
        </div>
      )
    }
  }, [weeklyAvailabilty, changes, day, slot])

  useEffect(() => {
    updateSlot(["", ""]);
  }, [day])

  useEffect(() => {
    console.log(slot);
    console.log(JSON.stringify(slot) == JSON.stringify(['8/6/2023', '12:15 PM']));
  }, [slot])

  if(!tutorExists){
    window.location.replace("/tutors");
  }
  if(!tutor) return <Loading />
  return (
    <main className='flex flex-col justify-between'>
      <div className='mr-8'>
        <h2> {tutor.first_name + " " + tutor.last_name} </h2>
        <div className = "mainTextArea h-full">
          <div className = "publicProfile items-stretch">
            <div id="sign-up-form" className=''>
              {/* <div className="aboutmeDiv mb-4">
                <h3 id = "label">About Me:</h3>
                <p className = "aboutMe">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit accusantium rem ad molestiae, itaque architecto! Doloremque possimus ex, odio assumenda ratione laborum maiores, facere perferendis voluptatum mollitia hic molestias libero.
                </p>
              </div> */}
              <div>
                <h3 id = "label">Classes I Tutor:</h3>
                <div className = "tutorCourses mt-2">
                  {courses}
                </div>
              </div>
              <div id = "twotable">
                <div>                    
                  <h3 id = "label">Hall:</h3>
                  <p className = "hallNumber">filler 1</p>
                </div>
                <div>                    
                  <h3 id = "label">Wing:</h3>
                  <p className = "hallNumber">filler 2</p>
                </div>                  
                </div>
            </div>
            <div className = "ml-4">
              <div className="flex flex-row">
                <Calendar className={"" + (isMobile ? "w-[350px]" : "w-[500px]")} locale="en-US" minDetail="month" defaultValue={new Date()} onChange={(val) => updateDay(new Date(val))} />
                <div className='flex flex-col justify-between w-40 ml-4 h-[318px]'>
                  {slotsContainer}
                  <button className='bg-[deepskyblue] rounded-md mt-2 p-2 font-bold text-[white] hover:bg-[#00afef]'>BOOK</button>
                </div>
              </div>
            </div>
          </div>
        </div> 
      </div>
      <Footer />
    </main>
  )
}