'use client'
import { MobileContext } from "@/contexts/MobileContext"
import { useContext, useEffect, useState } from 'react'
import classes from '../../public/classes.json'
import tutors from '../../public/tutor_data.json'
import Loading from "@/components/Loading"
import classTextToClassName from '../../data/classTextToClassName'
import TutorBox from "@/components/TutorBox"
import Grid2 from "@mui/material/Unstable_Grid2"
import { TutorData } from "@/types/tutordata"
import Footer from "@/components/Footer"


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
    if(classFilter === "any") {
      tempTutors = [...tutors];
    } else {
      let classNameFull = ((selectedLanguageClass == "") ? classFilter : selectedLanguageClass);
      console.log(classNameFull);
      if(classTextToClassName.has(classNameFull)){
        classNameFull = classTextToClassName.get(classNameFull);
      }

      if(selectedLanguageClass != "") {
        const c = classNameFull.split(" ");
        let num = "1";
        switch(c[1]){
          case "I":
            num = "1";
            break;
          case "II":
            num = "2";
            break;
          case "III":
            num = "3";
            break;
          case "IV":
            num = "4";
            break;
          case "V":
            num = "5";
        }
        classNameFull = c[0] + " " + num;
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
  }, [classFilter, hallFilter, selectedLanguageClass])

  useEffect(() => {
    if(subject != "Language"){
      return;
    }
    updateLanguageClassList(
      <select onChange={(event) => {updateSelectedLanguageClass(event.target.value)}} className={'border-secondary dark:border-secondary-dark bg-primary dark:bg-primary-dark border-2 rounded-sm ' + ((isMobile) ? 'ml-2': '')}>
        {classes.Language[classFilter].map((className) => {
          return <option value={className} key={className}>{className}</option>
        })}
      </select>
    )
    updateSelectedLanguageClass(classes.Language[classFilter][0]);
  }, [classFilter])

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
          return <option value={key} key={key}>{key}</option>
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
    <div className="h-[calc(100%-5rem)] bg-primary dark:bg-primary-dark flex flex-col">
      <div className="p-4 flex-grow flex flex-col ">
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
      <Footer />
    </div>
  )
}