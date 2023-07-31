export default function Help(){

  return (
    <div className="w-[90%] ml-auto mr-auto h-[calc(100%-5rem)] bg-cover bg-[url(/scattered-forcefields2.svg)] dark:bg-[url(/scattered-forcefields2-dark.svg)]">
      <div className="w-[min(32rem,_100%)] mt-8 ml-auto mr-auto bg-primary dark:bg-primary-dark rounded-lg border-2 border-[rgb(203,_213,_224)]">
        <form className="w-full p-4">
          <div className="mt-2">
            <h3 className="text-center text-2xl mt-4">Contact Us!</h3>
            <label id="label" className="text-lg" htmlFor="name">
              Name:
            </label>
            <input type="textarea" id="name" required className="bg-[white] dark:bg-primary-dark p-2 w-full border-2 rounded-md border-[rgb(203,_213,_224)]"/>
          </div>
          <div className="mt-4">
            <label id="label" className="text-lg" htmlFor="describeYourProblem">
              Describe the Issue:
            </label>
            <textarea name = "describeYourProblem" rows={4} className="resize-none bg-[white] dark:bg-primary-dark p-2 w-full border-2 rounded-md border-[rgb(203,_213,_224)]" required/>                                   
          </div>
          <b><input type="submit" value="Submit" id="Submit" className="mt-4 h-12 text-primary dark:text-primary-dark duration-300 ease-in-out w-full rounded-md bg-[rgb(93,_170,_244)] hover:bg-[rgb(74,_132,_220)]"/></b>
        </form>
      </div>
    </div>
  )
}