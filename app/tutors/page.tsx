'use client'
import { MobileContext } from "@/contexts/MobileContext"
import { useContext, useEffect, useState } from 'react'
import classes from '../../public/classes.json'
import tutors from '../../public/tutor_data.json'
import Loading from "@/components/Loading"
import TutorBox from "@/components/TutorBox"
import Grid2 from "@mui/material/Unstable_Grid2"
import { TutorData } from "@/types/tutordata"


export default function Tutors(){
  const isMobile = useContext(MobileContext);
  const [subject, updateSubject] = useState("");
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

  const [languageClassList, updateLanguageClassList] = useState(
    <select className="hidden"></select>
  )
  
  const [selectedLanguageClass, updateSelectedLanguageClass] = useState("");

  useEffect(() => {
    let tempTutors: TutorData[] = [];
    if(hallFilter != "Any Hall"){
      tutors.forEach((tutor: TutorData) => {
        if(String(tutor.hall) == hallFilter) tempTutors.push(tutor);
      })
    } else {
      tempTutors = [...tutors];
    }

    if(classFilter === "any" && subject != "Language") {
      // do nothing
    } else {
      for(let i = 0; i < tempTutors.length;){
        let tutor = tempTutors[i];
        if(
          !(tutor.biology?.includes(classFilter)) &&
          !(tutor.chemistry?.includes(classFilter)) &&
          !(tutor.physics?.includes(classFilter)) &&
          !(tutor.mathcore?.includes(classFilter)) &&
          !(tutor.moreMath?.includes(classFilter)) &&
          !(tutor.cs?.includes(classFilter)) &&
          !(tutor.otherScience?.includes(classFilter)) &&
          !(subject == "Language" && tutor.language?.includes(selectedLanguageClass))
        ){
          tempTutors.splice(i, 1);
        } else {
          ++i;
        }
      }
    }

    // Shuffle the tutor pool, for fairness
    for (let i = tempTutors.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = tempTutors[i];
      tempTutors[i] = tempTutors[j];
      tempTutors[j] = temp;
    }
    updateFilteredTutors(tempTutors);
  }, [classFilter, hallFilter, selectedLanguageClass])

  useEffect(() => {
    if(subject != "Language"){
      return;
    }
    updateLanguageClassList(
      <select onChange={(event) => {updateSelectedLanguageClass(event.target.value)}} className={'border-secondary dark:border-secondary-dark bg-primary dark:bg-primary-dark border-2 rounded-sm ' + ((isMobile) ? 'ml-2': 'mr-4')}>
        {classes.Language[classFilter].map((className) => {
          return <option value={className} key={className}>{className}</option>
        })}
      </select>
    )
    updateSelectedLanguageClass(classes.Language[classFilter][0]);
  }, [classFilter])

  if(loading){
    return (
      <Loading />
    )
  }

  const subjects = (
    <>
      <option hidden disabled value="default"> -- select a subject -- </option>
      {
        Object.keys(classes).map((key) =>{
          return <option value={key} key={key}>{key}</option>
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
    updateSubject(value);
    if(value === "Language") {
      updateClassList(
        <>
          <option value="Spanish" key="Spanish">Spanish</option>
          <option value="French" key="French">French</option>
          <option value="German" key="German">German</option>
          <option value="Mandarin" key="Mandarin">Mandarin</option>
        </>
      )
      updateSelectedLanguageClass("Spanish II");
      updateLanguageClassList(
        <select onChange={(event) => {updateSelectedLanguageClass(event.target.value)}} className={'border-secondary dark:border-secondary-dark bg-primary dark:bg-primary-dark border-2 rounded-sm ' + ((isMobile) ? 'ml-2': 'mr-4')}>
          {classes.Language.Spanish.map((className) => {
            return <option value={className} key={className}>{className}</option>
          })}
        </select>
      )
      updateSelectedLanguageClass(classes.Language.Spanish[0]);
      return;
    }
    updateLanguageClassList(
      <select className="hidden"></select>
    )
    updateSelectedLanguageClass("");
    updateClassList(
      <>
        {
          classes[value].map((className) => {
            return <option value={className} key={className}>{className}</option>
          })
        }
      </>
    )
    const classSelect = document.getElementById("class") as HTMLSelectElement;
    classSelect.value = classes[value][0]
    updateClassFilter(classes[value][0]);
  }
  return(
    <div className="h-full w-full bg-primary dark:bg-primary-dark p-4 flex-grow flex flex-col ">
      <div className={"mb-4 w-full p-2 h-fit flex border-2 border-secondary dark:border-secondary-dark rounded-md "+ (isMobile ? "flex-col" : "flex-row justify-center")}>
        <select defaultValue="default" id="subject" name="subject" className={'border-secondary dark:border-secondary-dark bg-primary dark:bg-primary-dark border-2 rounded-sm ' + (isMobile ? 'mb-2 block ml-auto mr-auto ' : "mr-4")} onChange={(event) => changeSubject(event.target.value)}>
          {subjects}
        </select>
        <div className={(isMobile) ? 'block ml-auto mr-auto': ''}>
          <select defaultValue="default" id="class" name="class" className={'border-secondary dark:border-secondary-dark bg-primary dark:bg-primary-dark border-2 rounded-sm ' + (isMobile ? 'mb-2' : "mr-4")} onChange={(event) => updateClassFilter(event.target.value)}>
            {classList}
          </select>
          {languageClassList}
        </div>
        <select id="hall" className={'border-secondary dark:border-secondary-dark bg-primary dark:bg-primary-dark border-2 rounded-sm ' + ((isMobile) ? 'block ml-auto mr-auto': '')} onChange={(event) => { updateHallFilter(event.target.value) }}>
          {halls}
        </select>
      </div>
      {
        filteredTutors?.length ? 
          <Grid2 container spacing={1}>
            {filteredTutors.map((tutor) => {
              return (
                <Grid2 key={tutor.id} xs={isMobile ? 12 : 3}>
                  <TutorBox data={tutor}/>
                </Grid2>
              )
            })}
          </Grid2> : 
          <div className="flex flex-col justify-center items-center flex-grow">
            There are no tutors for that subject.
          </div>
      }
    </div>
  )
}