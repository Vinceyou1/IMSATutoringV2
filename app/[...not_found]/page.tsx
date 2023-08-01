import './page.css'

export default function NotFound(){
  return(
    <div className="flex flex-col justify-center items-center gap-0.5 min-h-[90%]">
      <h1 className='text-3xl'>404 - Page not found</h1>
      {
        // Image by pikisuperstar Freepik
      }
      <img src="/5060709_2663518.svg" className="justify-center items-start max-w-[34rem] max-h-[24rem]"/>
      <p className="text-center"> The page you are looking for might have been temporarily removed, had its name changed, or is temporarily unavailable </p>

      <a href="/" className="buttonClickable3d">Return Home</a>
    </div>
  );
}