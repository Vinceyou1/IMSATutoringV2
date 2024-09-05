import { Changes, DayChange, Weekday } from "./types";

// time as hour:minute, 4:30PM would be 16:30
export function formatBlock(time: number) {
  const minutes = time % 100;
  const hour = Math.floor(time / 100);
  const pm = hour >= 12;
  let hours = hour % 12;
  if (hours == 0) hours = 12;
  return `${hours}:${minutes.toString().padStart(2, "0")} ${pm ? "PM" : "AM"}`;
}

// day is 0-indexed, Sunday is 0
export function isValidTime(time: number, day: number) {
  // no tutoring on Friday or Saturday
  if (day >= 5) return false;
  if (day == 0) return time >= 1400 && time <= 2300 && time !== 2200;
  else return time >= 1700 && time <= 2300 && time !== 2200;
}

export function combineChanges(weeklyTimes: number[], changes: DayChange) {
  let res = [...weeklyTimes];
  changes.dailyChanges.forEach((num) => {
    if (res.includes(num)) {
      res.splice(res.indexOf(num), 1);
    } else res.push(num);
  });
  changes.booked.forEach((num) => {
    if (res.includes(num)) {
      res.splice(res.indexOf(num), 1);
    } else console.log("This is very bad");
  });
  return res;
}

export function weekdayToIndex(day: keyof typeof Weekday) {
  switch (day) {
    case "Sunday":
      return 0;
    case "Monday":
      return 1;
    case "Tuesday":
      return 2;
    case "Wednesday":
      return 3;
    case "Thursday":
      return 4;
    case "Friday":
      return 5;
    case "Saturday":
      return 6;
    default:
      throw new Error("Invalid weekday");
  }
}

// Adjusted function to handle half-hour increments
export function hourAndSlotToTime(hour: number, slot: number) {
  let time = hour * 100;
  if (slot === 1) {
    time += 30; // Add 30 minutes for the second half of the hour
  }
  return time;
}

// Adjusted formatDay to ensure date formatting is consistent
export function formatDay(date: Date) {
  return date.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}
