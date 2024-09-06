// Should probably use date at some point, but I don't want to deal with timezones for now
import { DayChange, Weekday } from "./types";

function formatTime(time: number) {
  const minutes = time % 100;
  time -= minutes;
  time /= 100;
  let hours = time;
  const pm = hours >= 12;
  hours %= 12;
  if (hours == 0) hours += 12;
  return `${hours}:${minutes.toString().padStart(2, "0")}${pm ? "PM" : "AM"}`;
}

// time as hour:minute, 4:30PM would be 16:30
export function formatBlock(time: number) {
  let nextTime = time;
  nextTime += time % 100 == 0 ? 30 : 70;
  nextTime %= 2400;
  return formatTime(time) + " - " + formatTime(nextTime);
}

// day is 0-indexed, Sunday is 0
export function isValidTime(time: number, day: number) {
  // no tutoring on Friday or Saturday
  if (day >= 5) return false;
  if (day == 0) return time >= 1400 && time <= 2300 && time != 2200;
  else return time >= 1700 && time <= 2300 && time != 2200;
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

export function hourAndSlotToTime(hour: number, slot: number) {
  let time = hour * 100;
  if (slot) time += 30;
  return time;
}

export function formatDay(date: Date) {
  return date.toLocaleString("en-US").split(",").at(0)!;
}
