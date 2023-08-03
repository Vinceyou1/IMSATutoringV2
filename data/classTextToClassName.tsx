const classTextToClassName = new Map();
classTextToClassName.set("MI I/II", "Mathmatical Investigations 1/2");
classTextToClassName.set("MI II", "Mathematical Investigations 2");
classTextToClassName.set("MI III", "Mathematical Investigations 3")
classTextToClassName.set("MI IV", "Mathematical Investigations 4")
// This might need to change later is AB tutors actually exist
classTextToClassName.set("AB I", "BC Calculus 1");
classTextToClassName.set("AB II", "BC Calculus 2");
classTextToClassName.set("BC I", "BC Calculus 1");
classTextToClassName.set("BC II", "BC Calculus 2");
classTextToClassName.set("BC III", "BC Calculus 3");

// CS
classTextToClassName.set("CSI", "Computer Science Inquiry");
classTextToClassName.set("OOP", "Object Oriented Programming");

// Physics 
classTextToClassName.set("Physics C: Mechanics", "Physics: Calculus Based Mechanics");
classTextToClassName.set("Physics C: E&M", "Physics: Calculus Based Electricity and Magnetism");

classTextToClassName.set("MSI", "Method in Scientific Inquiry")

export default classTextToClassName