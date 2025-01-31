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

aboutMeString = "newTutorsFunFactAboutYouHobbiesArtistsThatYouLikePastJobsTravelThatYouveDonewantToDoWeWantToShareABitAboutYouThatIsBeyondYourSuccessInTheClassroomThisWillBeSharedInTheResidenceHallAndDuringPeerTutorSpotlightWhichWillBePromotedInTheMainBuildingReturningTutorsWriteNaSinceThisWasCompletedInTheFallUnlessYouWantToChangeYouFunFact"

# TODO: also process selected times from the google form
def transform(data):
    f = open("../public/tutor_data2.json", "w")
    f.write("[\n")
    old_data = json.load(open('../public/tutor_data.json', 'r'))
    for i in range(len(data)):
        student = data[i]
        d = {}
        d["mathcore"] = None if student["coreMath"] == "None" else student["coreMath"].split(", ")
        d["moreMath"] = None if student["otherMath"] == "None" else student["otherMath"].split(", ")
        d["cs"] = None if student["computerScience"] == "None" else student["computerScience"].split(", ")
        d["biology"] = None if student["biology"] == "None" else student["biology"].split(", ")
        d["chemistry"] = None if student["chemistry"] == "None" else student["chemistry"].split(", ")
        d["physics"] = None if student["physics"] == "None" else student["physics"].split(", ")
        d["language"] = None if student["language"] == "None" else student["language"].split(", ")
        d["otherScience"] = None if student["otherScience"] == "None" else student["otherScience"].split(", ")
        # TODO: fix issue that apostrophes are converted to \u00e2\u20ac\u2122
        if str(student[aboutMeString]).lower() == "n/a":
            for old_student in old_data:
                print(old_student["id"])
                if old_student["id"] == student["imsaId"]:
                    d["aboutMe"] = old_student["aboutMe"]
        else:
            d["aboutMe"] = student[aboutMeString]
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