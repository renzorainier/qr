import { useState } from "react";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

function StudentCollection() {
  const [students, setStudents] = useState([
    { id: "402969160037", name: "ALARCON, RHYZEA", section: "ST-1B", strand: "STEM" },
    { id: "109339100105", name: "BANTOG, THAMZ JAZLEY", section: "ST-1B", strand: "STEM" },
    { id: "114235070063", name: "BUCOG, JESSIELYN", section: "ST-1B", strand: "STEM" },
    { id: "109327100246", name: "BUAL, GABRIEL JOHN", section: "ST-1B", strand: "STEM" },
    { id: "109351121673", name: "DAEP, CASSANDRA", section: "ST-1B", strand: "STEM" },
    { id: "117873090005", name: "CAMIRING, LEO", section: "ST-1B", strand: "STEM" },
    { id: "402941150090", name: "EDANG, CHESKA", section: "ST-1B", strand: "STEM" },
    { id: "109309120128", name: "DELA CRUZ, MICHAEL", section: "ST-1B", strand: "STEM" },
    { id: "109311100191", name: "GALARION, MIRALYN", section: "ST-1B", strand: "STEM" },
    { id: "109351121499", name: "DOMINGO, EZEKIEL", section: "ST-1B", strand: "STEM" },
    { id: "109327100789", name: "LOGRONIO, JENNIFER", section: "ST-1B", strand: "STEM" },
    { id: "402889150055", name: "GA, JAZPER SID", section: "ST-1B", strand: "STEM" },
    { id: "109354100093", name: "MEDALLADA, ANDREA", section: "ST-1B", strand: "STEM" },
    { id: "109350090352", name: "GELAGA, MARK AARON", section: "ST-1B", strand: "STEM" },
    { id: "109352130003", name: "MERIOLES, KEZEAH", section: "ST-1B", strand: "STEM" },
    { id: "109329100333", name: "MALLARI, JHAZREAL", section: "ST-1B", strand: "STEM" },
    { id: "109350100604", name: "NALZARO, CHRISTIAN", section: "ST-1B", strand: "STEM" },
    { id: "109311100426", name: "VALLECERA, ROEL", section: "ST-1B", strand: "STEM" },
    { id: "109336100225", name: "INAS, JUSTIN", section: "ST-1B", strand: "STEM" },
    { id: "109352100024", name: "BELDA, CAMILLE SHAINNE", section: "ST-1B", strand: "STEM" },
    { id: "109351121626", name: "FURAQUE, REYNALDO JR", section: "ST-1B", strand: "STEM" },
    { id: "109328100017", name: "ARBOLEDA, JERICHO", section: "ST-1B", strand: "STEM" },
    { id: "109311100063", name: "BATALLER, ADRIAN", section: "ST-1B", strand: "STEM" },
    { id: "109329100110", name: "BULATAO, ALEXA", section: "ST-1B", strand: "STEM" },
    { id: "136487100093", name: "CALIO, JOHN PAUL", section: "ST-1B", strand: "STEM" },
    { id: "109329100178", name: "DAGOOC, SHARMAINE", section: "ST-1B", strand: "STEM" },
    { id: "109320120604", name: "CARAGAN, AARON", section: "ST-1B", strand: "STEM" },
    { id: "109311100161", name: "ESPONILLA, ALYSSA", section: "ST-1B", strand: "STEM" },
    { id: "136890080155", name: "DINDO, JOMAR", section: "ST-1B", strand: "STEM" },
    { id: "109339131281", name: "HULLEZA, PRECIOUS", section: "ST-1B", strand: "STEM" },
    { id: "109339100469", name: "LOPEZ, ERIN", section: "ST-1B", strand: "STEM" },
    { id: "109328100149", name: "LONQUINO, KLAUS", section: "ST-1B", strand: "STEM" },
    { id: "109311100271", name: "MENDI, CELINE JOY", section: "ST-1B", strand: "STEM" },
    { id: "109343100139", name: "POLINAR, MARJORIE", section: "ST-1B", strand: "STEM" },
    { id: "109329100329", name: "MALICDEM, CARLO", section: "ST-1B", strand: "STEM" },
    { id: "109351121641", name: "PASAGDAN, RENZ RAINIER", section: "ST-1B", strand: "STEM" },
    { id: "109351121636", name: "SAMANIEGO, SEAN", section: "ST-1B", strand: "STEM" },
    { id: "109351121643", name: "PUREZA, XEDRICK", section: "ST-1B", strand: "STEM" },
    { id: "109311100219", name: "ILAO, GIAN RUSSEL", section: "ST-1B", strand: "STEM" },
    { id: "425707150124", name: "REGIS, YESTIN GABRIEL", section: "ST-1B", strand: "STEM" }
  ]);

  const createCollection = async () => {
    const studentsCollectionRef = collection(db, "strands", "STEM", "1B");
    const batch = [];

    students.forEach((student) => {
      const studentRef = doc(studentsCollectionRef, student.id);
      batch.push(setDoc(studentRef, { strand: student.strand, present: false, name: student.name, section: student.section, badges: [] }));
    });
    try {
      await Promise.all(batch);
      console.log("Students collection created successfully");
    } catch (e) {
      console.error("Error creating students collection: ", e);
    }
  };

  return (
    <div>
      <button onClick={createCollection}>Create Students Collection</button>
    </div>
  );
}

export default StudentCollection;
