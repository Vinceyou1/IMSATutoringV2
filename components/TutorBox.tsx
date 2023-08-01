import { TutorData } from "@/types/tutordata";


export default function TutorBox({data}: {data: TutorData}){
    return (
        <a href={"/tutors/" + data.id} className="block bg-primary dark:bg-primary-dark border-2 rounded-lg p-4 pl-6 w-full">
            {data.first_name + " " + data.last_name} <br/>
            {data.year}
        </a>
    )
}