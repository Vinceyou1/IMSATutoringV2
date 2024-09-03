"use client";
import "./page.css";
import { Changes, TutorData } from "@/lib/types";
import tutors from "../../../public/tutor_data.json";
import { useCallback, useContext, useEffect, useState } from "react";
import Loading from "@/components/Loading";
import Calendar from "react-calendar";
import { MobileContext } from "@/contexts/MobileContext";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { FirebaseFirestoreContext } from "@/contexts/FirebaseContext";
import { WeeklyAvailability } from "@/lib/types";
import { UserDataContext } from "@/contexts/UserContext";
import Popup from "reactjs-popup";
import { combineChanges, formatBlock } from "@/lib/appointments";
import clsx from "clsx";
import { usePathname } from "next/navigation";

export default function TutorPage() {
  const path = usePathname().split("/");
  const id = parseInt(path.at(path.length - 1)!);
  const isMobile = useContext(MobileContext);
  const user = useContext(UserDataContext);
  const [tutor, updateTutor] = useState<TutorData>();
  const [tutorExists, updateTutorExists] = useState(true);
  const [courses, updateCourses] = useState([<></>]);

  // Sorts the class list by their length
  const sortTutorSubjects = useCallback(() => {
    if (!tutor) return;

    const dataNameToText = {
      mathcore: "Math Courses(Core)",
      moreMath: "Math Courses(Non-Core)",
      physics: "Physics Courses",
      biology: "Biology Courses",
      chemistry: "Chemistry Courses",
      cs: "CS Courses",
      language: "Language Courses",
      otherScience: "Other Science Courses",
    };

    // really shitty implementation
    const {
      mathcore,
      moreMath,
      physics,
      biology,
      chemistry,
      cs,
      language,
      otherScience,
    } = tutor;
    const temp = {
      mathcore,
      moreMath,
      physics,
      biology,
      chemistry,
      cs,
      language,
      otherScience,
    };
    type ClassName = keyof typeof temp;
    let sorted: [ClassName, string[] | null][] = [];
    for (const [key, val] of Object.entries(temp)) {
      sorted.push([key as ClassName, val]);
    }

    const ans = sorted.map((element) => {
      if (element[1]) {
        return (
          <div className="courses" key={element[0]}>
            <h3 id="labelUnder">{dataNameToText[element[0]]}</h3>
            <div className="courses">
              {element[1].map((course) => {
                return <ul key={course}>{course}</ul>;
              })}
            </div>
          </div>
        );
      } else return <></>;
    });
    if (ans) updateCourses(ans);
  }, [tutor]);

  useEffect(() => {
    let exists = false;
    tutors.forEach((tutor: TutorData) => {
      if (tutor.id == id) {
        updateTutor(tutor);
        exists = true;
      }
    });
    updateTutorExists(exists);
    sortTutorSubjects();
  }, [id, sortTutorSubjects, tutor]);

  const [day, updateDay] = useState<Date>(new Date());
  const [time, updateTime] = useState(-1);

  const [weeklyAvailabilty, updateWeeklyAvailability] =
    useState<WeeklyAvailability>({
      Sunday: [],
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
    });

  const db = useContext(FirebaseFirestoreContext);
  const [changes, updateChanges] = useState<Changes>({});

  useEffect(() => {
    const getData = async () => {
      if (!tutor || !tutor.id || !db) return;
      const tutorRef = doc(db, "tutors", String(tutor.id));
      onSnapshot(tutorRef, (doc) => {
        if (doc.get("weekly")) {
          updateWeeklyAvailability(doc.get("weekly"));
        }
        if (doc.get("changes")) {
          updateChanges(doc.get("changes"));
        }
      });
    };
    getData();
  }, [tutor, db]);

  // TODO: refactor this into just logic, absolutely no need for a state here
  const [slotsContainer, updateSlotsContainer] = useState(<></>);

  function dateToWeekday(date: Date) {
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

  function formatDate(date: Date) {
    return date.toLocaleString("en-US").split(",").at(0)!;
  }
  useEffect(() => {
    const w = dateToWeekday(day);
    const d = formatDate(day);
    if (user[1]) {
      updateSlotsContainer(
        <div
          className={
            (isMobile ? "h-full w-1/2" : "h-0 flex-grow") +
            " border-2 border-[rgb(203,_213,_224)] dark:border-[white] p-2 flex flex-row items-center"
          }
        >
          <p className="text-center w-full">Loading...</p>
        </div>
      );
      return;
    }
    if (!user[0]) {
      updateSlotsContainer(
        <div
          className={
            (isMobile ? "h-full w-1/2" : "h-0 flex-grow") +
            " h-0 border-2 border-[rgb(203,_213,_224)] dark:border-[white] p-2 flex flex-row items-center"
          }
        >
          <p className="text-center w-full">
            Please Sign In With Your IMSA email
          </p>
        </div>
      );
      return;
    }
    let slots: number[] = [...weeklyAvailabilty[w]];
    if (changes.hasOwnProperty(d)) {
      slots = combineChanges(slots, changes[d]);
    }
    slots.sort((a, b) => a - b);

    if (slots.length > 0) {
      updateSlotsContainer(
        <div
          id="slots"
          className={
            (isMobile ? "h-full w-1/2" : "h-0 flex-grow") +
            " border-2 border-[rgb(203,_213,_224)] dark:border-[white] p-4 overflow-y-auto"
          }
        >
          {slots.map((value) => {
            return (
              <button
                key={value}
                onClick={() => {
                  time == value ? updateTime(-1) : updateTime(value);
                }}
                className={clsx(
                  "mb-4 w-full p-2 rounded-lg border-2 last:mb-0 duration-300",
                  { "bg-[deepskyblue]": value == time }
                )}
              >
                {formatBlock(value)}
              </button>
            );
          })}
        </div>
      );
    } else {
      updateSlotsContainer(
        <div
          className={
            (isMobile ? "h-full w-1/2" : "h-0 flex-grow") +
            " border-2 border-[rgb(203,_213,_224)] dark:border-[white] p-2 flex flex-row items-center"
          }
        >
          <p className="text-center w-full">
            The tutor is not available today.
          </p>
        </div>
      );
    }
  }, [weeklyAvailabilty, changes, day, user, isMobile, time]);

  const [booking, updateBooking] = useState(false);
  const [error, updateError] = useState(false);

  const [popupOpen, updatePopupOpen] = useState(false);
  const slotSelected = time != -1;

  async function book() {
    if (!user[0]) {
      updatePopupOpen(true);
      return;
    }
    if (!tutor || !tutor.id) {
      alert("This tutor doesn't exist?");
      return;
    }
    if(!slotSelected){
      alert("Please select an appointment.")
    }
    if (!db) return;
    const tutorRef = doc(db, "tutors", String(tutor.id));
    updateError(false);
    updateBooking(true);
    let booked = [time];
    let dailyChanges: number[] = [];
    const d = formatDate(day);
    if (changes.hasOwnProperty(d)) {
      booked = booked.concat(changes[d].booked);
      dailyChanges = changes[d].dailyChanges;
    }
    let error = false;
    await setDoc(
      tutorRef,
      {
        changes: {
          [d]: {
            booked,
            dailyChanges,
          },
        },
      },
      { merge: true }
    )
      .catch(() => {
        updateError(true);
        error = true;
      })
      .then(() => {
        if (error) {
          updateBooking(false);
          updateTime(-1);
          return;
        }
      });

    const studentRef = doc(db, "bookings", user[0].uid);
    await setDoc(
      studentRef,
      {
        [d + "-" + time]: tutor.id,
      },
      { merge: true }
    )
      .catch(() => {
        updateError(true);
        error = true;
      })
      .then(() => {
        if (error) {
          updateBooking(false);
          updateTime(-1);
          return;
        }
      });

    let info = "";
    const info_element = document.getElementById("info") as HTMLTextAreaElement;
    if (info_element) info = info_element.value;
    await addDoc(collection(db, "mail"), {
      to: tutor.email,
      cc: user[0].email,
      template: {
        name: "Booked",
        data: {
          name: user[0].displayName,
          tutor: tutor.firstName,
          time: formatBlock(time),
          day: d,
          info: info,
        },
      },
    })
      .catch(() => {
        updateError(true);
      })
      .then(() => {
        updateBooking(false);
        updateTime(-1);
        info_element.value = "";
      });
  }

  if (!tutorExists) {
    window.location.replace("/tutors");
  }

  // TODO: Prevent students from booking appoinments during slots they already booked w/ other tutors
  // Prevent students from booking

  // Big TODO: get rid of all the isMobile stuff and replace with just tailwind md: classes
  const bookingSection = (
    <div className={"h-fit " + (isMobile ? "mt-4" : "ml-4")}>
      {isMobile ? (
        <div className="flex flex-col w-[325px]">
          <Calendar
            minDate={new Date()}
            className="w-[350px]"
            locale="en-US"
            minDetail="month"
            defaultValue={new Date()}
            onChange={(val) => {
              updateTime(-1);
              updateDay(new Date(val));
            }}
          />
          <div className="flex flex-row mt-4 h-[200px] w-full">
            {slotsContainer}
            <textarea
              id="info"
              className="rounded-none ml-2 flex-grow resize-none border-2 h-full p-2 border-[rgb(203,_213,_224)] dark:border-[white] bg-primary dark:bg-primary-dark"
              placeholder="Additional Notes (optional)"
            ></textarea>
          </div>
          <button
            onClick={book}
            className={clsx(
              "mb-4 w-full duration-300 rounded-md mt-2 p-2 font-bold text-[white]",
              {
                "bg-[red]": error,
                "bg-[grey]": !(error || slotSelected),
                "bg-[deepskyblue] hover:bg-[#00afef]": !error && slotSelected,
              }
            )}
          >
            {error ? "Error" : booking ? "Booking..." : "BOOK"}
          </button>
        </div>
      ) : (
        <div className="flex flex-col">
          <div className={"flex flex-row items-stretch"}>
            <Calendar
              minDate={new Date()}
              className="w-[500px]"
              locale="en-US"
              minDetail="month"
              defaultValue={new Date()}
              onChange={(val) => {
                updateTime(-1);
                updateDay(new Date(val));
              }}
            />
            <div
              className={
                "flex flex-col justify-between ml-4 w-40 " +
                (isMobile ? "w-full mt-4" : "ml-4 w-40")
              }
            >
              {slotsContainer}
              <textarea
                id="info"
                className="flex-grow-0 resize-none border-2 mt-2 h-24 p-2 border-[rgb(203,_213,_224)] dark:border-[white] bg-primary dark:bg-primary-dark"
                placeholder="Additional Notes (optional)"
              ></textarea>
            </div>
          </div>
          <button
            onClick={book}
            className={clsx(
              "mb-4 w-full duration-300 rounded-md mt-2 p-2 font-bold text-[white]",
              {
                "bg-[red]": error,
                "bg-[grey]": !(error || slotSelected),
                "bg-[deepskyblue] hover:bg-[#00afef]": !error && slotSelected,
              }
            )}
          >
            {error ? "Error" : booking ? "Booking..." : "BOOK"}
          </button>
        </div>
      )}
    </div>
  );

  if (!tutor || !db) return <Loading />;
  return (
    <div className="flex flex-col justify-between w-full">
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
      <div className="mr-8 mb-8">
        <h2> {tutor.firstName + " " + tutor.lastName} </h2>
        <div className="mainTextArea h-fit">
          <div
            className={
              "publicProfile items-stretch " +
              (isMobile ? "flex-col !mt-4" : "flex-row")
            }
          >
            <div id="sign-up-form">
              <div className="mb-4">
                <h3 id="label">About Me:</h3>
                <p className="mt-2">{tutor.aboutMe}</p>
              </div>
              <div>
                <h3 id="label">Classes I Tutor:</h3>
                <div className="tutorCourses mt-2">{courses}</div>
              </div>
              <div id="twotable">
                <div>
                  <h3 id="label">Hall:</h3>
                  <p className="hallNumber">{tutor.hall}</p>
                </div>
                <div>
                  <h3 id="label">Wing:</h3>
                  <p className="hallNumber">{tutor.wing}</p>
                </div>
              </div>
            </div>
            {bookingSection}
          </div>
        </div>
      </div>
    </div>
  );
}
