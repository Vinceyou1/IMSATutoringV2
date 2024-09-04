import json

def parsetime(s):
    if s is None:
        return None
    stringparts = s.split(',')
    times = []
    for time in stringparts:
        parts = time.split(":")
        time = 1200 + int(parts[0]) * 100
        time += int(parts[1][0:2])
        times.append(time)
    return times

def addTimes(data):
    f = open("../public/times.json", "w")
    f.write("[\n")
    for i in range(len(data)):
        student = data[i]
        d = {}
        d["id"] = student["imsaId"]
        for day in ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"]:
            try:
                d[day] = parsetime(student[day.lower()])
            except:
                continue
        f.write(json.dumps(d))
        f.write("," if i != len(data) - 1 else "")
        f.write("\n")
    f.write("]")


# TODO: also process selected times from the google form
def transform(data):
    f = open("../public/tutor_data.json", "w")
    f.write("[\n")
    for i in range(len(data)):
        student = data[i]
        d = {}
        d["mathcore"] = None if student["coreMath"] == "None" else student["coreMath"].split(", ")
        d["moreMath"] = None if student["otherMath"] == "None" else student["otherMath"].split(", ")
        d["cs"] = None if student["cs"] == "None" else student["cs"].split(", ")
        d["biology"] = None if student["biology"] == "None" else student["biology"].split(", ")
        d["chemistry"] = None if student["chemistry"] == "None" else student["chemistry"].split(", ")
        d["physics"] = None if student["physics"] == "None" else student["physics"].split(", ")
        d["language"] = None if student["language"] == "None" else student["language"].split(", ")
        d["otherScience"] = None if student["otherScience"] == "None" else student["otherScience"].split(", ")
        # TODO: fix issue that apostrophes are converted to \u00e2\u20ac\u2122
        d["aboutMe"] = student["funFactAboutYouHobbiesArtistsThatYouLikePastJobsTravelThatYouveDonewantToDoWeWantToShareABitAboutYouThatIsBeyondYourSuccessInTheClassroomThisWillBeSharedInTheResidenceHallAndDuringPeerTutorSpotlightWhichWillBePromotedInTheMainBuilding"]
        d["email"] = student["imsaEmail"]
        d["id"] = student["imsaId"]
        d["firstName"] = student["firstName"]
        d["lastName"] = student["lastName"]
        d["hall"] = student["hall"]
        d["wing"] = student["wing"]
        d["graduationYear"] = student["graduationYear"]
        f.write(json.dumps(d))
        f.write("," if i != len(data) - 1 else "")
        f.write("\n")
    f.write("]")

jsonfile = open('data.json', 'r')
transform(json.load(jsonfile))