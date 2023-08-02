'use client'
import './page.css'
import { TutorData } from '@/types/tutordata'
import tutors from '../../../data/tutor_data.json'
import { useEffect, useState } from 'react'
import Loading from '@/components/Loading';

export default function TutorPage({params}){
  const [tutor, updateTutor] = useState<TutorData>();
  const [tutorExists, updateTutorExists] = useState(true);
  const [courses, updateCourses] = useState([<></>]);
  useEffect(() => {
    tutors.forEach((tutor: TutorData) => {
      if(tutor.id == params.id) updateTutor(tutor);
    });
    if(!tutor) updateTutorExists(false);
    sortTutorSubjects();
  }, [tutor])

  const dataNameToText = {
    "math_courses": "Math Courses",
    physics_courses: "Physics Courses",
    bio_courses: "Biology Courses",
    chem_course: "Chemistry Courses",
    cs_courses: "CS Courses",
    language_courses: "Language Courses",
    other_courses: "Other Science Courses"
  }

  // Sorts the class list by their length 
  function sortTutorSubjects(){
    if(!tutor) return;
    const temp = JSON.parse(JSON.stringify(tutor));
    delete temp['last_name'];
    delete temp['first_name'];
    delete temp['id'];
    delete temp['year'];

    const sorted = Object.keys(temp).map((key) => [key, temp[key]]);
    sorted.sort((a, b) => {
      if(!a[1]) return 1;
      if(!b[1]) return -1;
      return b[1].length - a[1].length;
    });
    const ans = sorted.map((element) => {
      if(element[1]){
        return(
          <div className = "courses" key={element[0]}>
            <h3 id = "labelUnder">{dataNameToText[element[0]]}</h3>
            <div className="courses">
              {element[1].map((course) => {
                return <ul>{course}</ul>
              })}
            </div>
          </div>
        );
      } else return (<></>)
    });
    if(ans) updateCourses(ans);
  }

  if(!tutor) return <Loading />
  return (
    <main>
      <h2> {tutor.first_name + " " + tutor.last_name} </h2>
      <div className = "mainTextArea">
        <div className = "publicProfile">
          <div id="sign-up-form">
            <div className="aboutmeDiv">
              <h3 id = "label">About Me:</h3>
              <p className = "aboutMe">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit accusantium rem ad molestiae, itaque architecto! Doloremque possimus ex, odio assumenda ratione laborum maiores, facere perferendis voluptatum mollitia hic molestias libero.
              </p>
            </div>
            <div className = "mt-4">
              <h3 id = "label">Classes I Tutor:</h3>
              <div className = "tutorCourses mt-2">
                {courses}
              </div>
            </div>
            <div id = "twotable">
              <div>                    
                <h3 id = "label">Hall:</h3>
                <p className = "hallNumber">filler 1</p>
              </div>
              <div>                    
                <h3 id = "label">Wing:</h3>
                <p className = "hallNumber">filler 2</p>
              </div>                  
              </div>
          </div>
          <div className = "imageSelector">
            <div
                className="base-image-input"
              >
              <span
                  v-if="!imageData"
                  className="placeholder"
              >
              Image Here
              </span>
            </div>
          </div>
          <br/>
          <br/>
          <br/>
          <br/>
        </div>
      </div> 
    </main>
  )
}