'use client'
import { MobileContext } from "@/contexts/MobileContext"
import { useContext, useEffect, useState } from 'react'
import classes from '../../data/classes.json'
import tutors from '../../data/tutor_data.json'
import Loading from "@/components/Loading"
import classTextToClassName from '../../data/classTextToClassName'
import TutorBox from "@/components/TutorBox"
import Grid2 from "@mui/material/Unstable_Grid2"
import { TutorData } from "@/types/tutordata"


export default function Tutors(){
  const isMobile = useContext(MobileContext);
  const [classFilter, updateClassFilter] = useState("any");
  const [hallFilter, updateHallFilter] = useState("Any Hall");
  const [filteredTutors, updateFilteredTutors] = useState<TutorData[]>();
  const [classList, updateClassList] = useState(
    <>
      <option hidden disabled value="default"> -- select a subject first -- </option>
    </>
  );

  const [loading, updateLoading] = useState(true);
  useEffect(() => {
    updateLoading(false);
  }, [])

  useEffect(() => {
    let tempTutors: TutorData[] = [];
    if(classFilter === "any") {
      tempTutors = [...tutors];
    } else {
      let classNameFull = classFilter;
      if(classTextToClassName.has(classNameFull)){
        classNameFull = classTextToClassName.get(classNameFull);
      }
      tutors.forEach((tutor: TutorData) => {
        let canTutorClass = false;
        if(tutor.bio_courses && tutor.bio_courses.includes(classNameFull)){
          canTutorClass = true;
        }
        else if(tutor.chem_course && tutor.chem_course.includes(classNameFull)){
          canTutorClass = true;
        }
        else if(tutor.cs_courses && tutor.cs_courses.includes(classNameFull)){
          canTutorClass = true;
        }
        else if(tutor.math_courses && tutor.math_courses.includes(classNameFull)){
          canTutorClass = true;
        }
        else if(tutor.physics_courses && tutor.physics_courses.includes(classNameFull)){
          canTutorClass = true;
        }
        else if(tutor.language_courses && tutor.language_courses.includes(classNameFull)){
          canTutorClass = true;
        }
        else if(tutor.other_courses && tutor.other_courses.includes(classNameFull)){
          canTutorClass = true;
        }
        if(canTutorClass) tempTutors.push(tutor);
      });
    }
    // Shuffle the tutor pool, for fairness
    for (let i = tempTutors.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = tempTutors[i];
      tempTutors[i] = tempTutors[j];
      tempTutors[j] = temp;
    }
    updateFilteredTutors(tempTutors);
    // TODO: implement hall filter when I get hall data
  }, [classFilter, hallFilter])

  if(loading){
    return (
      <div className='h-[calc(100%-5rem)]'>
        <Loading />
      </div>
    )
  }

  const subjects = (
    <>
      <option hidden disabled value="default"> -- select a subject -- </option>
      {
        Object.keys(classes).map((key) =>{
          return <option value={key}>{key}</option>
        })
      }
    </>
  )

  // Hall Filter won't work for now, cuz I don't actually have hall data
  const halls = (
    <>
      <option value="Any Hall">Any Hall</option>
      <option value="1501">1501</option>
      <option value="1502">1502</option>
      <option value="1503">1503</option>
      <option value="1504">1504</option>
      <option value="1505">1505</option>
      <option value="1506">1506</option>
      <option value="1507">1507</option>
    </>
  )

  function changeSubject(value: string) {
    if(value === "Language") return;
    updateClassList(
      <>
        {
          classes[value].map((className) => {
            return <option value={className}>{className}</option>
          })
        }
      </>
    )
    const classSelect = document.getElementById("class") as HTMLSelectElement;
    classSelect.value = classes[value][0]
    updateClassFilter(classes[value][0]);
  }
  return(
    <div className="h-[calc(100%-5rem)] bg-primary dark:bg-primary-dark p-4">
      <div className={"mb-4 ml-auto mr-auto w-fit p-2 h-fit flex border-2 border-secondary dark:border-secondary-dark rounded-md " + (isMobile ? "flex-col" : "flex-row")}>
        <select defaultValue="default" id="subject" name="subject" className={'border-secondary dark:border-secondary-dark bg-primary dark:bg-primary-dark border-2 rounded-sm ' + (isMobile ? 'mb-2' : "mr-4")} onChange={(event) => changeSubject(event.target.value)}>
          {subjects}
        </select>
        <select defaultValue="default" id="class" name="class" className={'border-secondary dark:border-secondary-dark bg-primary dark:bg-primary-dark border-2 rounded-sm ' + (isMobile ? 'mb-2' : "mr-4")} onChange={(event) => updateClassFilter(event.target.value)}>
          {classList}
        </select>
        <select id="hall" className='border-secondary dark:border-secondary-dark bg-primary dark:bg-primary-dark border-2 rounded-sm' onChange={(event) => { updateHallFilter(event.target.value) }}>
          {halls}
        </select>
      </div>
      <Grid2 container spacing={1}>
        {filteredTutors.map((tutor) => {
          return (
            <Grid2 xs={isMobile ? 12 : 3}>
              <TutorBox data={tutor}/>
            </Grid2>
          )
        })}
      </Grid2>
    </div>
  )
}