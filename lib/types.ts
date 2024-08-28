export type TutorData = {
    "lastName": string, 
    "firstName": string,
    "aboutMe": string,
    "id": number,
    "hall": number,
    "wing": string,
    "graduationYear": number,
    "email": string,
    "mathcore": string[] | null,
    "moreMath": string[] | null,
    "physics": string[] | null,
    "biology": string[] | null,
    "chemistry": string[] | null,
    "cs": string[] | null,
    "language": string[] | null,
    "otherScience": string[] | null,
}
export enum Weekday {
    Sunday = "Sunday",
    Monday = "Monday",
    Tuesday = "Tuesday",
    Wednesday = "Wednesday",
    Thursday = "Thursday",
    Friday = "Friday",
    Saturday = "Saturday"
}

export type WeeklyAvailability = Record<Weekday, number[]>;

export type DayChange = {
    dailyChanges: number[],
    booked: number[]
}

export type Changes = Record<string, {
    dailyChanges: number[],
    booked: number[]
}>