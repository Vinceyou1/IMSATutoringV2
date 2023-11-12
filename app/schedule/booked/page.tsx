'use client'
import Loading from "@/components/Loading";
import { UserDataContext } from "@/contexts/UserContext";
import { useContext, useEffect, useState } from "react"
import { MobileContext } from "@/contexts/MobileContext";
import tutors from '../../../public/tutor_data.json'
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { TutorData } from "@/types/tutordata";
import { addDoc, collection, doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { FirebaseFirestoreContext } from "@/contexts/FirebaseContext";
import Image from 'next/image';
import './page.css';

export default function Booked(){
  const user = useContext(UserDataContext);
  const isMobile = useContext(MobileContext);
  const [studentActive, updateStudentActive] = useState(true);

  const [tutor, updateTutor] = useState<TutorData>();

  const [loading, updateLoading] = useState(true);
  const [studentData, updateStudentData] = useState({});
  const [tutorData, updateTutorData] = useState({});
  const db = useContext(FirebaseFirestoreContext);

  useEffect(() => {
    if(!user[0] || !user[0].displayName){
      updateTutor(null);
      return;
    }

    const email = user[0].email;
    tutors.forEach((tutor: TutorData) => {
      if(tutor.emailAddress == email){
        updateTutor(tutor);
      }
    });

    const getData = async () => {
      if(!tutor || !tutor.id) return;
      const tutorRef = doc(db, 'tutors', String(tutor.id));
      onSnapshot(tutorRef, (doc) => {
        let d = doc.data();
        if(doc.get('weekly')){
          delete d['weekly'];
        }
        if(d){
          updateTutorData(d);
        }
      });
    }
    getData();
  }, [user, db, tutor])


  useEffect(() => {
    updateLoading(true);
    if(!user[0] || !user[0].uid) {
      return;
    }

    const getStudentData = async () => {
      const studentRef = doc(db, 'bookings', user[0].uid);
      onSnapshot(studentRef, (doc) => {
        if(doc.data()){
          updateStudentData(
            doc.data()
          );
        }
      })
    }
    getStudentData();
    updateLoading(false);
  }, [user, db])

  const [loadingArray, updateLoadingArray] = useState<string[]>([]);

  if(user[1]){
    return (
      <Loading />
    )
  }

  if(!user[0]){
    return(
      <div className="bg-center flex flex-col items-center justify-center h-full bg-[url(/scattered-forcefields7.svg)] bg-cover bg-no-repeat">
        Please Sign In With Your IMSA email
      </div>
    )
  }

  function idToTutor(id: string){
    let tutor_name = "";
    const name = tutors.forEach((tutor) => {if(tutor.id == id) tutor_name = tutor.first_name + " " + tutor.last_name});
    return tutor_name
  }

  async function removeBooking(key: string, tutor_id: number){
    const s = key.split(" ");
    const day = s.at(0);
    const time = s.at(1) + " " + s.at(2);
    updateLoadingArray(loadingArray.concat(day + " " + time));
    let tutor : TutorData = null;
    tutors.forEach((t: TutorData) => {
      if(t.id == tutor_id.toString()){
        tutor = t;
      }
    })

    if(!tutor) return;

    const tutorRef = doc(db, 'tutors', tutor_id.toString());
    await getDoc(tutorRef).then(async (doc) => {
      let d = doc.data();
      console.log(d);
      if(d){
        if(d.hasOwnProperty(day) && d[day].booked.includes(time)){
          d[day].booked.splice(d[day].booked.indexOf(time), 1);
          await setDoc(tutorRef, d);
        }
      }
    })

    const studentRef = doc(db, 'bookings', user[0].uid);
    const d = JSON.parse(JSON.stringify(studentData));
    delete d[day + " " + time];
    await setDoc(studentRef, d);

    await addDoc(collection(db, "mail"), {
      to: tutor.email,
      cc: user[0].email,
      template: {
        name: "Cancel",
        data: {
          name: user[0].displayName,
          tutor: tutor.first_name,
          time: time,
          day: day,
        },
      },
    })

    let temp = [...loadingArray];
    temp.splice(temp.indexOf(day + " " + time), 1);
    updateLoadingArray(temp);
  }



  const bookings = studentActive ?
    loading ? <Loading /> : 
    Object.keys(studentData).length === 0 ? <div className="w-full h-full flex items-center justify-center text-xl text-center"><p>You have not booked any appointments yet.</p></div> :
    <Grid2 container spacing={2}>
      {
        Object.keys(studentData).map((key) => (
          <Grid2 key={key} xs={12 / (isMobile ? 1 : 4)}>
            <div className="rounded-lg p-2 border-2 border-[rgb(203,_213,_224)] flex flex-row justify-between items-center">
              <p className="pl-2 mr-2">{key} - {idToTutor(studentData[key])}</p>
              <button className="w-12 h-12" onClick={() => {
                removeBooking(key, studentData[key])
              }}>{loadingArray.includes(key) ? <div className="reverse-spinner" style={{width: "48px"}}></div> : <Image id={key} width={48} height={48} src='/bin.png' alt='' />}</button>
            </div>
          </Grid2>
        ))
      }
    </Grid2>
  :
  tutor ? <>Welcome {tutor.first_name}</> :  <div className="w-full h-full flex items-center justify-center border-2 text-xl text-center"><p>You are not registered as a tutor.</p></div>

  return (
    <div className="p-8 bg-center flex flex-col h-full bg-[url(/scattered-forcefields7.svg)] bg-cover bg-no-repeat">
      <div className="flex flex-row items-end">
        <button onClick={() => updateStudentActive(true)} className={"border-2 border-b-0 border-[rgb(203,_213,_224)] p-2 rounded-t-xl mr-2 " + (studentActive ? "text-xl font-bold " : "text-sm")}>Student</button>
        <button onClick={() => updateStudentActive(false)} className={"border-2 border-b-0 border-[rgb(203,_213,_224)] p-2 rounded-t-xl " + (!studentActive ? "text-xl font-bold " : "text-sm")}>Tutor</button>
      </div>
      <div className="border-2 flex-grow p-4 border-[rgb(203,_213,_224)]">
        {bookings}
      </div>
    </div>
  )
}