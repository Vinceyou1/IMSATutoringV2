'use client'
import './page.css'
import { TutorData } from '@/types/tutordata'
import tutors from '../../../data/tutor_data.json'
import { useEffect, useState } from 'react'
import Loading from '@/components/Loading';

export default function TutorPage({params}){
  const [tutor, updateTutor] = useState<TutorData>();
  const [tutorExists, updateTutorExists] = useState(true);

  useEffect(() => {
    tutors.forEach((tutor: TutorData) => {
      if(tutor.id == params.id) updateTutor(tutor);
    });
    if(!tutor) updateTutorExists(false);
  }, [])

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
            <div className = "tutorSubjectsDiv">
              <h3 id = "label">Subjects I Tutor:</h3>
              <div className = "tutorCourses">
                {tutor.math_courses ? 
                <div className = "courses">
                  <h3 id = "labelUnder">Math Courses</h3>
                  <div className="courses">
                    {tutor.math_courses?.map((course) => {
                      return <ul>{course}</ul>
                    })}
                  </div>
                </div> :<></> }
                {tutor.cs_courses ? 
                <div className = "courses">
                  <h3 id = "labelUnder">CS Courses</h3>
                  <div className="courses">
                    {tutor.math_courses?.map((course) => {
                      return <ul>{course}</ul>
                    })}
                  </div>
                </div> :<></> }
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