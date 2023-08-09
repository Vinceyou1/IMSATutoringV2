'use client'

import Footer from "@/components/Footer";
import { FirebaseFirestoreContext } from "@/contexts/FirebaseContext";
import { addDoc, collection } from "firebase/firestore";
import { useContext, useState } from "react";

export default function Help(){
  const [error_visible, seterror_visible] = useState(false);
  const db = useContext(FirebaseFirestoreContext);
  async function submitContact(){
    const name = (document.getElementById("name") as HTMLInputElement).value;
    const issue = (document.getElementById("issue") as HTMLTextAreaElement).value;
    if(name === "" || issue === ""){
      seterror_visible(true);
      return;
    }
    seterror_visible(false);
    const submitButton = (document.getElementById("submit") as HTMLButtonElement);
    submitButton.innerHTML = "SUBMITTING...";
    await addDoc(collection(db, "mail"), {
      to: ["vyou@imsa.edu"],
      template: {
        name: "Contact",
        data: {
          name: name,
          issue: issue
        },
      },
    }).then(() => {
      submitButton.innerHTML = "SUCCESS!"
    }).catch(() => {
      submitButton.innerHTML = "ERROR"
    }).then(() => {
      alert("done!");
    });
  }
  return (
    <div className="flex flex-col w-full h-[calc(100%-5rem)] bg-cover bg-[url(/scattered-forcefields2.svg)] dark:bg-[url(/scattered-forcefields2-dark.svg)]">
      <div className="w-[90%] ml-auto mr-auto flex flex-row flex-grow items-center">
        <div className="w-[min(32rem,_90%)] mt-8 ml-auto mr-auto bg-primary dark:bg-primary-dark rounded-lg border-2 border-[rgb(203,_213,_224)] p-4">
          <div className="mt-2">
            <h3 className="text-center text-2xl mt-4">Contact Us!</h3>
            <label id="label" className="text-lg" htmlFor="name">
              Name:
            </label>
            <input type="textarea" id="name" name="name" required className="bg-[white] dark:bg-primary-dark p-2 w-full border-2 rounded-md border-[rgb(203,_213,_224)]"/>
          </div>
          <div className="mt-4">
            <label id="label" className="text-lg" htmlFor="issue">
              Describe the Issue:
            </label>
            <textarea id="issue" name = "issue" rows={4} className="resize-none bg-[white] dark:bg-primary-dark p-2 w-full border-2 rounded-md border-[rgb(203,_213,_224)]" required/>                                   
          </div>
          <p className={"text-[red] text-center " + (error_visible ? "mt-2 visible" : "h-0 invisible")}>You need to fill in all fields.</p>
          <button onClick={() => {submitContact()}} id="submit" className="mt-4 h-12 text-primary dark:text-primary-dark duration-300 ease-in-out w-full rounded-md bg-[rgb(93,_170,_244)] hover:bg-[rgb(74,_132,_220)] font-bold">SUBMIT</button>
        </div>
      </div>
      <Footer />
    </div>
  )
}