"use client";
import Loading from "@/components/Loading";
import { UserDataContext } from "@/contexts/UserContext";
import { useContext, useEffect, useState } from "react";
import { MobileContext } from "@/contexts/MobileContext";
import tutors from "../../../public/tutor_data.json";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { TutorData } from "@/lib/types";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { FirebaseFirestoreContext } from "@/contexts/FirebaseContext";
import Image from "next/image";
import "./page.css";
import { formatBlock } from "@/lib/appointments";

// TODO: add what appointments a tutor has
export default function Booked() {
  const user = useContext(UserDataContext);
  const isMobile = useContext(MobileContext);
  const [loading, updateLoading] = useState(true);
  const [studentData, updateStudentData] = useState<Record<string, number>>({});
  const db = useContext(FirebaseFirestoreContext);

  useEffect(() => {
    updateLoading(true);

    const getStudentData = async () => {
      if (!user[0] || !user[0].uid || !db) {
        return;
      }
      const studentRef = doc(db, "bookings", user[0].uid);
      onSnapshot(studentRef, (doc) => {
        const data = doc.data();
        if (data) {
          updateStudentData(data);
        }
      });
    };
    getStudentData();
    updateLoading(false);
  }, [user, db]);

  const [loadingArray, updateLoadingArray] = useState<string[]>([]);

  if (user[1] || !db) {
    return <Loading />;
  }

  if (!user[0]) {
    return (
      <div className="bg-center flex flex-col items-center justify-center h-full bg-[url(/scattered-forcefields7.svg)] bg-cover bg-no-repeat">
        Please Sign In With Your IMSA email
      </div>
    );
  }

  function idToTutor(id: number) {
    let name = "";
    tutors.forEach((tutor: TutorData) => {
      if (tutor.id == id) name = tutor.firstName + " " + tutor.lastName;
    });
    return name;
  }

  function keyToDayTime(key: string): [string, number]{
    const s = key.split("-");
    const day = s.at(0)!;
    const time = parseInt(s.at(1)!);
    return [day, time];
  }

  async function removeBooking(key: string, tutor_id: number) {
    if (!user[0] || !db) return;
    const ans =  keyToDayTime(key);
    const day = ans[0];
    const time = ans[1];
    updateLoadingArray(loadingArray.concat(key));
    let tutor: TutorData | null = null;
    tutors.forEach((t: TutorData) => {
      if (t.id.toString() == tutor_id.toString()) {
        tutor = t;
      }
    });
    if (!tutor) {
      alert(
        "Your tutor wasn't found (please let me know this is a very big problem)."
      );
      return;
    }

    // really shouldn't have to do this, TODO
    tutor = tutor as TutorData;

    const tutorRef = doc(db, "tutors", tutor_id.toString());
    await getDoc(tutorRef).then(async (doc) => {
      let changes = doc.get("changes");
      if (changes && day) {
        if (changes.hasOwnProperty(day) && changes[day].booked.includes(time)) {
          changes[day].booked.splice(changes[day].booked.indexOf(time), 1);
          await setDoc(tutorRef, { changes }, { merge: true });
        }
      }
    });

    const studentRef = doc(db, "bookings", user[0].uid);
    const d = {...studentData};
    delete d[key];
    await setDoc(studentRef, d);

    await addDoc(collection(db, "mail"), {
      to: tutor.emailAddress,
      cc: user[0].email,
      template: {
        name: "Cancel",
        data: {
          name: user[0].displayName,
          tutor: tutor.firstName,
          time: formatBlock(time),
          day: day,
        },
      },
    });

    let temp = [...loadingArray];
    temp.splice(temp.indexOf(day + " " + time), 1);
    updateLoadingArray(temp);
  }

  const bookings = loading ? (
    <Loading />
  ) : Object.keys(studentData).length === 0 ? (
    <div className="w-full h-full flex items-center justify-center text-xl text-center">
      <p>You have not booked any appointments yet.</p>
    </div>
  ) : (
    <Grid2 container spacing={2}>
      {Object.keys(studentData).map((key) => (
        <Grid2 key={key} xs={12 / (isMobile ? 1 : 4)}>
          <div className="rounded-lg p-2 border-2 border-[rgb(203,_213,_224)] flex flex-row justify-between items-center">
            <p className="pl-2 mr-2">
              {keyToDayTime(key)[0] + " " + formatBlock(keyToDayTime(key)[1])} - {idToTutor(studentData[key])}
            </p>
            <button
              className="w-12 h-12"
              onClick={() => {
                removeBooking(key, studentData[key]);
              }}
            >
              {loadingArray.includes(key) ? (
                <div
                  className="reverse-spinner"
                  style={{ width: "48px" }}
                ></div>
              ) : (
                <Image id={key} width={48} height={48} src="/bin.png" alt="" />
              )}
            </button>
          </div>
        </Grid2>
      ))}
    </Grid2>
  );

  return (
    <div className="p-8 bg-center flex flex-col w-full bg-[url(/scattered-forcefields7.svg)] bg-cover bg-no-repeat">
      <h1 className="font-bold pb-2 text-2xl">Bookings</h1>
      <div className="border-2 flex-grow p-4 border-[rgb(203,_213,_224)]">
        {bookings}
      </div>
    </div>
  );
}
