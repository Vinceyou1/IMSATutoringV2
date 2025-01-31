"use client";
import { UserDataContext } from "@/contexts/UserContext";
import { useContext, useEffect, useState } from "react";
import tutors from "../../../../public/tutor_data.json";
import { TutorData, Weekday } from "@/lib/types";
import Loading from "@/components/Loading";
import { LocalizationProvider, TimeClock } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { WeeklyAvailability } from "@/lib/types";
import { FirebaseFirestoreContext } from "@/contexts/FirebaseContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import clsx from "clsx";
import {
  formatBlock,
  hourAndSlotToTime,
  isValidTime,
  weekdayToIndex,
} from "@/lib/appointments";

export default function Weekly() {
  const user = useContext(UserDataContext);
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
      if (tutor.email == email) {
        updateTutor(tutor);
        updateTutorExists(true);
      }
    });
  }, [user]);

  const [activeDay, updateActiveDay] = useState<keyof typeof Weekday>("Sunday");
  const [AM, updateAM] = useState(true);
  const [currSelectedHour, updateCurrSelectedHour] = useState(-1);
  const [availabilty, updateAvailability] = useState<WeeklyAvailability>({
    Sunday: [],
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
  });

  useEffect(() => {
    const getData = async () => {
      if (!tutor || !tutor.id || !db) return;
      const tutorRef = doc(db, "tutors", String(tutor.id));
      await getDoc(tutorRef).then((doc) => {
        if (doc.get("weekly")) {
          updateAvailability(doc.get("weekly"));
        }
      });
    };
    getData();
  }, [tutor, db]);

  function time(slot: number) {
    return hourAndSlotToTime(currSelectedHour + (AM ? 0 : 12), slot);
  }

  function availabilityIncluded(slot: number, day: keyof typeof Weekday) {
    return availabilty[day].includes(time(slot));
  }

  function handleAvailability(slot: number, day: keyof typeof Weekday) {
    const str = time(slot);
    const temp = JSON.parse(JSON.stringify(availabilty));
    if (availabilityIncluded(slot, activeDay)) {
      temp[activeDay].splice(availabilty[activeDay].indexOf(str), 1);
    } else {
      temp[activeDay].push(str);
    }
    updateAvailability(temp);
  }

  const [saving, updateSaving] = useState(false);

  // TODO: verify 3 hours per week
  async function saveAvailability() {
    if (!tutor || !tutor.id || !db) {
      alert("Error! Are you signed in?");
      return;
    }
    let numBlocks = 0;
    Object.entries(availabilty).map(([_, val]) => (numBlocks += val.length));
    if (numBlocks < 6){
      alert("You should be signed up for at least 6 blocks per week.");
      return;
    }

    const tutorRef = doc(db, "tutors", String(tutor.id));
    updateSaving(true);
    await setDoc(tutorRef, { weekly: availabilty }, { merge: true })
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
      <div className="flex items-center text-lg justify-center w-full">
        Please Sign In With Your IMSA email
      </div>
    );
  }

  if (!tutorExists) {
    return (
      <div className="flex items-center justify-center text-center text-lg w-full">
        Hmm, you don&apos;t seem to be registered as a peer tutor. <br /> If you
        are, please fill out the help form.
      </div>
    );
  }

  // general idea: lots of collapsables, so one dropdown for each day, then a dropdown for each hour, then buttons for each 15-minute block and location
  return (
    <div className="m-4 bg-[url(/scattered-forcefields5.svg)]bg-cover bg-no-repeat w-full">
      <div className="flex-col w-fit ml-auto mr-auto">
        <div className="w-full border-2 rounded-t-lg">
          <select
            className="text-lg block mr-auto ml-auto bg-primary dark:bg-primary-dark"
            onChange={(change) =>
              updateActiveDay(change.target.value as keyof typeof Weekday)
            }
          >
            {Object.keys(Weekday).map((day) => (
              <option value={day} key={day}>
                {day}
              </option>
            ))}
          </select>
        </div>
        <div className="border-2 border-t-0 rounded-b-lg flex flex-col items-center p-4 duration-0">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimeClock
              ampm={true}
              sx={{
                margin: 0,
              }}
              onChange={(value) => {
                console.log(value);
                updateCurrSelectedHour(value.$H);
              }}
              views={["hours"]}
            />
          </LocalizationProvider>
          <div className={clsx("m-0 flex flex-row justify-center")}>
            <button
              onClick={() => {
                updateAM(true);
              }}
              className={
                "rounded-sm p-4 mr-4 " + (AM ? "bg-[deepskyblue]" : "")
              }
            >
              AM
            </button>
            <button
              onClick={() => {
                updateAM(false);
              }}
              className={"rounded-sm p-4 " + (!AM ? "bg-[deepskyblue]" : "")}
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
              .filter((num) =>
                isValidTime(time(num), weekdayToIndex(activeDay))
              )
              .map((num) => (
                <button
                  key={num}
                  onClick={() => handleAvailability(num, activeDay)}
                  className={clsx("mt-4 w-full p-2 rounded-lg border-2", {
                    "bg-[deepskyblue]": availabilityIncluded(num, activeDay),
                  })}
                >
                  {formatBlock(time(num))}
                </button>
              ))}
          </div>
          {[0, 1].filter((num) =>
            isValidTime(time(num), weekdayToIndex(activeDay))
          ).length == 0 && (
            <>
              <p className="mt-4">Appointments should be between 5:00-10:00</p>
              <p>& 10:30-11:30 PM Monday through Thursday, </p>
              <p>and 2:00-10:00 & 10:30-11:30PM on Sunday.</p>
            </>
          )}
        </div>
      </div>
      <div className="flex flex-row items-center justify-center mb-2 mt-8">
        <button
          className="border-2 p-4 w-32 rounded-md mr-6"
          onClick={saveAvailability}
        >
          {saving ? "SAVING..." : "SAVE"}
        </button>
        <button
          className="border-2 p-4 w-32 rounded-md"
          onClick={() => {
            updateAvailability({
              Sunday: [],
              Monday: [],
              Tuesday: [],
              Wednesday: [],
              Thursday: [],
              Friday: [],
              Saturday: [],
            });
          }}
        >
          CLEAR
        </button>
      </div>
    </div>
  );
}
