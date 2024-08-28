"use client";
import { FirebaseFirestoreContext } from "@/contexts/FirebaseContext";
import { MobileContext } from "@/contexts/MobileContext";
import { UserDataContext } from "@/contexts/UserContext";
import { Changes, TutorData } from "@/lib/types";
import { useCallback, useContext, useEffect, useState } from "react";
import tutors from "../../../../public/tutor_data.json";
import { WeeklyAvailability } from "@/lib/types";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Loading from "@/components/Loading";
import "./page.css";
import Calendar from "react-calendar";
import { LocalizationProvider, TimeClock } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  formatBlock,
  formatDay,
  hourAndSlotToTime,
  isValidTime,
  weekdayToIndex,
} from "@/lib/appointments";
import clsx from "clsx";

export default function Daily() {
  const user = useContext(UserDataContext);
  const isMobile = useContext(MobileContext);
  const db = useContext(FirebaseFirestoreContext);

  const [tutor, updateTutor] = useState<TutorData>();
  const [tutorExists, updateTutorExists] = useState(false);

  useEffect(() => {
    if (!user[0] || !user[0].displayName) {
      updateTutorExists(false);
      return;
    }

    const email = user[0].email;
    tutors.forEach((tutor: TutorData) => {
      if (tutor.emailAddress == email) {
        updateTutor(tutor);
        updateTutorExists(true);
      }
    });
  }, [user]);

  const [day, updateDay] = useState(new Date());
  const [AM, updateAM] = useState(true);
  const [currSelectedHour, updateCurrSelectedHour] = useState(-1);
  const [weeklyAvailability, updateWeeklyAvailability] =
    useState<WeeklyAvailability>({
      Sunday: [],
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
    });

  const [changes, updateChanges] = useState<Changes>({});

  function time(slot: number) {
    return hourAndSlotToTime(currSelectedHour + (AM ? 0 : 12), slot);
  }

  const getData = async () => {
    if (!tutor || !tutor.id || !db) return;
    const tutorRef = doc(db, "tutors", String(tutor.id));
    await getDoc(tutorRef).then((doc) => {
      if (doc.get("weekly")) {
        updateWeeklyAvailability(doc.get("weekly"));
      }
      if (doc.get("changes")) {
        // do some sort of data verification?
        updateChanges(doc.get("changes"));
      }
    });
  };
  useEffect(() => {
    getData();
  }, [tutor]);

  useEffect(() => {
    updateDay(new Date());
  }, []);

  function handleAvailability(slot: number) {
    const t = time(slot);
    let temp = { ...changes };
    const d = formatDay(day);
    if (!changes.hasOwnProperty(d)) {
      temp[d] = {
        dailyChanges: [],
        booked: [],
      };
    }
    if (temp[d].dailyChanges.includes(t)) {
      temp[d].dailyChanges.splice(temp[d].dailyChanges.indexOf(t), 1);
      if (temp[d].dailyChanges.length == 0 && temp[d].booked.length == 0) {
        delete temp[d];
      }
    } else {
      temp[d].dailyChanges.push(t);
    }
    updateChanges(temp);
  }

  function numToWeekday(date: Date) {
    const day = date.getDay();
    switch (day) {
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
    return "Monday";
  }

  function getColor(slot: number) {
    const t = time(slot);
    const d = formatDay(day);
    if (weeklyAvailability[numToWeekday(day)].includes(t)) {
      if (changes.hasOwnProperty(d) && changes[d].dailyChanges.includes(t)) {
        return "bg-[red]";
      } else {
        return "bg-[deepskyblue]";
      }
    } else {
      if (changes.hasOwnProperty(d) && changes[d].dailyChanges.includes(t)) {
        return "bg-[green]";
      } else {
        return "bg-none";
      }
    }
  }

  const [saving, updateSaving] = useState(false);

  async function saveAvailability() {
    if (!tutor || !tutor.id) {
      alert("Error! Are you signed in?");
      return;
    }
    if (!db) return;
    const tutorRef = doc(db, "tutors", String(tutor.id));
    updateSaving(true);
    await setDoc(
      tutorRef,
      { changes: changes, weekly: weeklyAvailability },
      { merge: false }
    )
      .catch(() => {
        alert("There's been an error. Please try again.");
      })
      .then(() => {
        updateSaving(false);
      });
  }

  if (user[1] || !db) {
    return <Loading />;
  }

  if (!user[0]) {
    return (
      <div className="w-full flex items-center text-lg justify-center h-full">
        Please Sign In With Your IMSA email
      </div>
    );
  }

  if (!tutorExists) {
    return (
      <div className="w-full flex items-center justify-center text-center text-lg h-full">
        Hmm, you don&apos;t seem to be registered as a peer tutor. <br /> If you
        are, please fill out the help form.
      </div>
    );
  }

  // TODO: Figure out what happens if you cancel an appointment while someone booked already
  return (
    <div className="w-full flex flex-col">
      <div className="flex flex-col flex-grow justify-between">
        <div
          className={
            "flex flex-grow w-full justify-center items-center p-4 " +
            (isMobile ? "flex-col" : "flex-row ")
          }
        >
          <div className={isMobile ? "mb-4" : "mr-16"}>
            <Calendar
              minDate={new Date()}
              className={isMobile ? "w-[350px]" : "w-[500px]"}
              locale="en-US"
              minDetail="month"
              defaultValue={new Date()}
              // types are a little fucked here
              onChange={(val) => updateDay(new Date(val))}
            />
          </div>
          <div
            className={
              "dark:text-primary flex flex-col justify-start items-center overflow-x-hidden h-fit border-2 p-4 rounded-lg w-[350px]"
            }
          >
            <div>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimeClock
                  ampm={true}
                  sx={{}}
                  onChange={(value) => {
                    updateCurrSelectedHour(value.$H);
                  }}
                  views={["hours"]}
                />
              </LocalizationProvider>
            </div>
            <div className="m-0 flex flex-row">
              <button
                onClick={() => {
                  updateAM(true);
                }}
                className={
                  "duration-200 rounded-sm p-4 mr-4 " +
                  (AM ? "bg-[deepskyblue]" : "")
                }
              >
                AM
              </button>
              <button
                onClick={() => {
                  updateAM(false);
                }}
                className={
                  "duration-200 rounded-sm p-4 " +
                  (!AM ? "bg-[deepskyblue]" : "")
                }
              >
                PM
              </button>
            </div>
            <div
              className={clsx("w-full flex flex-col items-center", {
                hidden: currSelectedHour == -1,
              })}
            >
              {[0, 1]
                .filter((num) => isValidTime(time(num), day.getDay()))
                .map((num) => (
                  <button
                    key={num}
                    onClick={() => handleAvailability(num)}
                    className={clsx(
                      "mt-4 w-full p-2 rounded-lg border-2",
                      getColor(num)
                    )}
                  >
                    {formatBlock(time(num))}
                  </button>
                ))}
            </div>
            {[0, 1].filter((num) => isValidTime(time(num), day.getDay()))
              .length == 0 && (
              <>
                <p className="mt-4">
                  Appointments should be between 5:00-10:00 & 10:30-11:30 PM
                  Monday through Thursday, and 2:00-10:00 & 10:30-11:30PM on
                  Sunday.
                </p>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-row items-center justify-center mb-4">
          <button
            className="border-2 p-4 w-32 rounded-md mr-6"
            onClick={saveAvailability}
          >
            {saving ? "SAVING..." : "SAVE"}
          </button>
          <button className="border-2 p-4 w-32 rounded-md" onClick={getData}>
            RESET
          </button>
        </div>
      </div>
    </div>
  );
}
