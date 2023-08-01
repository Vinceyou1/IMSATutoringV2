'use client'
import { MobileContext } from "@/contexts/MobileContext"
import { useContext, useEffect, useState } from 'react'
import classes from '../../data/classes.json'
import tutors from '../../data/tutor_data.json'
import Loading from "@/components/Loading"
import classTextToClassName from '../../data/classTextToClassName'


export default function Tutors(){
  const isMobile = useContext(MobileContext);
  const [classFilter, updateClassFilter] = useState("any");
  const [hallFilter, updateHallFilter] = useState("Any Hall");
  const [classList, updateClassList] = useState(
    <>
      <option hidden disabled value="default"> -- select a subject first -- </option>
    </>
  );

  const [loading, updateLoading] = useState(true);
  useEffect(() => {
    updateLoading(false);
  }, [])

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
      <div className={"ml-auto mr-auto w-fit p-2 h-fit flex border-2 border-[grey] rounded-md " + (isMobile ? "flex-col" : "flex-row")}>
        <select defaultValue="default" id="subject" name="subject" className={'bg-primary dark:bg-primary-dark border-2 rounded-sm ' + (isMobile ? 'mb-2' : "mr-4")} onChange={(event) => changeSubject(event.target.value)}>
          {subjects}
        </select>
        <select defaultValue="default" id="class" name="class" className={'bg-primary dark:bg-primary-dark border-2 rounded-sm ' + (isMobile ? 'mb-2' : "mr-4")} onChange={(event) => updateClassFilter(event.target.value)}>
          {classList}
        </select>
        <select id="hall" className='bg-primary dark:bg-primary-dark border-2 rounded-sm' onChange={(event) => { updateHallFilter(event.target.value) }}>
          {halls}
        </select>
      </div>
    </div>
  )
}