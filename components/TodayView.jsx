import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import { db } from "./firebase.js";

function TodayAttendance() {
  const [todayAttendance, setTodayAttendance] = useState([]);
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [selectedSection, setSelectedSection] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [infoText, setInfoText] = useState("");

  const sections = ["1A", "1B", "1C", "1D", "2A"];

  useEffect(() => {
    const fetchAttendance = async () => {
      const presentStudents = [];
      for (const section of sections) {
        const presentStudentsQuery = query(
          collection(db, "strands", "STEM", section),
          where("present", "==", true)
        );
        const presentStudentsQuerySnapshot = await getDocs(
          presentStudentsQuery
        );
        presentStudents.push(
          ...presentStudentsQuerySnapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name,
            lastScan: doc.data().lastScan?.toDate() || null,
            section,
            strand: doc.data().strand,
            attendanceStatus: doc.data().attendanceStatus,
            attendanceDifference: doc.data().attendanceDifference,
          }))
        );
      }
      presentStudents.sort((a, b) => b.lastScan - a.lastScan);
      setTodayAttendance(presentStudents);
      setFilteredAttendance(presentStudents);
      setIsLoading(false);
    };

    fetchAttendance();
  }, [sections]);

  useEffect(() => {
    const filteredStudents = todayAttendance.filter(
      (student) =>
        (!selectedSection || student.section === selectedSection) &&
        (!searchQuery ||
          student.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredAttendance(filteredStudents);
  }, [selectedSection, searchQuery, todayAttendance]);

  const handleSectionChange = (event) => {
    setSelectedSection(event.target.value);
  };

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const sortedAttendance = filteredAttendance.slice().sort((a, b) => {
    if (a.lastScan && b.lastScan) {
      return b.lastScan.getTime() - a.lastScan.getTime();
    } else if (a.lastScan) {
      return -1;
    } else {
      return 1;
    }
  });

  if (isLoading) {
    return (
      <div className="container py-10 px-10 mx-0 min-w-full flex flex-col items-center">
        <button
          disabled
          type="button"
          className="bg-white hover:bg-gray-100 focus:ring-4 focus:ring-gray-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-800 dark:focus:ring-gray-500 inline-flex items-center"
        >
          <svg
            aria-hidden="true"
            role="status"
            className="inline w-4 h-4 mr-3 text-gray-900 animate-spin"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="#E5E7EB"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentColor"
            />
          </svg>
          Loading...
        </button>
      </div>
    );
  }

  function handleHeaderClick(text) {
    setShowInfo(true);
    setInfoText(text);
  }

  return (
    <div className="flex justify-center pt-1 items-center">
      <div
        className="w-full text-gray-700 bg-white p-5 text-sm rounded-lg shadow-lg mx-auto"
        style={{ maxWidth: "90%" }}
      >
        <div className="bg-gray-200 relative rounded-lg">
          {/* <img
            src="https://static.planetminecraft.com/files/profile_banner/3800851_1.gif"
            alt="background gif"
            className="absolute top-0 left-0 w-full h-full object-cover z-0 rounded-lg"
          /> */}
          <div className="relative z-10">
            <h2 className="text-gray-700 text-xl font-bold text-center">
              Attendance For Today
            </h2>
            <h1 className="text-gray-700 font-bold text-base mb-4 text-center">
              ({new Date().toLocaleDateString()})
            </h1>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center flex-grow">
            <select
              value={selectedSection}
              onChange={handleSectionChange}
              className="border rounded-md py-1 px-2 text-gray-700 w-full"
            >
              <option value="">All</option>
              {sections.map((section) => (
                <option key={section} value={section}>
                  {section}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center flex-grow">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchQueryChange}
              className="border rounded-md py-1 px-2 text-gray-700 w-full"
              placeholder="Search by name"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg">
          <table className="table-auto w-full text-center ">
            <thead className="bg-gray-200 text-" style={{ border: "none" }}>
              <tr className="p-2 font-bold">
                <th
                  className="p-2 pb-4 pt-4 "
                  onClick={() =>
                    handleHeaderClick(
                      "Index - shows the index of the students baseds on their scan time."
                    )
                  }
                  style={{
                    background: "transparent",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  #
                </th>
                <th
                  className="p-2"
                  onClick={() =>
                    handleHeaderClick("NAME - shows the name of the students")
                  }
                  style={{
                    background: "transparent",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  NAME
                </th>
                <th
                  className="p-2"
                  onClick={() =>
                    handleHeaderClick(
                      "STRAND - shows the strand of the students"
                    )
                  }
                  style={{
                    background: "transparent",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  STRAND
                </th>
                <th
                  className="p-2"
                  onClick={() =>
                    handleHeaderClick(
                      "SEC - shows the section of the students."
                    )
                  }
                  style={{
                    background: "transparent",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  SEC
                </th>
                <th
                  className="p-2"
                  onClick={() =>
                    handleHeaderClick(
                      "SCANNED - shows the time the students was scanned for the day, red means late, yellow means on time, and green means early."
                    )
                  }
                  style={{
                    background: "transparent",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  SCANNED:
                </th>
              </tr>
            </thead>

            <tbody>
              {sortedAttendance.map((student, index) => (
                <tr
                  className={`${
                    index % 2 === 0 ? "bg-gray-100" : "bg-gray-200"
                  } rounded-lg mb-2`}
                  key={student.id}
                >
                  <td className="p-2">{sortedAttendance.length - index}</td>
                  <td className="p-2 font-bold whitespace-nowrap">
                    {student.name}
                  </td>
                  <td className="p-2">{student.strand}</td>
                  <td className="p-2 ">{student.section}</td>
                  presentStudents.
                </tr>
              ))}
            </tbody>
          </table>
          {showInfo && (
            <div
              id="show"
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  max-w-90% bg-white p-5 rounded-lg shadow-lg inline-block"
            >
              <p className="text-gray-700 text-center">{infoText}</p>
              <button
                className="block mx-auto mt-4 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                onClick={() => setShowInfo(false)}
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TodayAttendance;

// import React, { useState, useEffect } from "react";
// import {
//   collection,
//   query,
//   where,
//   getDocs,
//   getDoc,
//   doc,
// } from "firebase/firestore";
// import { db } from "./firebase.js";

// function TodayAttendance() {
//   const [todayAttendance, setTodayAttendance] = useState([]);
//   const [filteredAttendance, setFilteredAttendance] = useState([]);
//   const [selectedSection, setSelectedSection] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");

//   useEffect(() => {
//     const fetchTodayAttendance = async () => {
//       let presentStudentsQuery = collection(db, "strands", "STEM", selectedSection);

//       presentStudentsQuery = query(presentStudentsQuery, where("present", "==", true));

//       const presentStudentsQuerySnapshot = await getDocs(presentStudentsQuery);
//       const presentStudents = presentStudentsQuerySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         name: doc.data().name,
//         lastScan: doc.data().lastScan?.toDate() || null,
//         section: doc.data().section,
//         strand: doc.data().strand,
//       }));

//       presentStudents.sort((a, b) => b.lastScan - a.lastScan);
//       setTodayAttendance(presentStudents);
//       setFilteredAttendance(presentStudents);
//     };

//     fetchTodayAttendance();
//   }, [selectedSection]);

//   useEffect(() => {
//     const filteredStudents = todayAttendance.filter(
//       (student) =>

//         (!selectedSection || student.section === selectedSection) &&
//         (!searchQuery ||
//           student.name.toLowerCase().includes(searchQuery.toLowerCase()))
//     );
//     setFilteredAttendance(filteredStudents);
//   }, [ selectedSection, searchQuery, todayAttendance]);

// const sections = ["1A", "1B", "2A", "2B", "3A", "3B"];

//   const handleSectionChange = (event) => {
//     setSelectedSection(event.target.value);
//   };

//   const handleSearchQueryChange = (event) => {
//     setSearchQuery(event.target.value);
//   };

//   return (
//     <div className=" text-gray-700 bg-white p-8 pr-8 divide-x divide-y rounded-lg shadow-lg inline-block">
//       <h2 className="text-gray-700 text-xl font-bold mb-4">
//         Attendance For Today
//       </h2>
//       <div className="flex justify-between mb-4">
//         <div className="flex items-center">
//           <label className="text-gray-700 font-bold mr-2">Section:</label>
//           <select
//             value={selectedSection}
//             onChange={handleSectionChange}
//             className="border rounded-md py-1 px-2 text-gray-700"
//           >
//             <option value="">All</option>
//             {sections.map((section) => (
//               <option key={section} value={section}>
//                 {section}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div className="flex items-center">
//           <label className="text-gray-700 font-bold mr-2">Search:</label>
//           <input
//             type="text"
//             value={searchQuery}
//             onChange={handleSearchQueryChange}
//             className="border rounded-md py-1 px-2 text-gray-700"
//             placeholder="Search by name"
//           />
//         </div>
//       </div>
//       <div className="overflow-x-auto">
//         <table className="table-auto border-collapse w-full">
//           <thead>
//             <tr>
//               <th className="border p-2">#</th>
//               <th className="border p-2">Name</th>
//               <th className="border p-2">Strand</th>
//               <th className="border p-2">Section</th>
//               <th className="border p-2">Last Scan</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredAttendance.map((student, index) => (
//               <tr key={student.id}>
//                 <td className="border p-2">{index + 1}</td>
//                 <td className="border p-2">{student.name}</td>
//                 <td className="border p-2">{student.strand}</td>
//                 <td className="border p-2">{student.section}</td>
//                 <td className="border p-2">
//                   {student.lastScan ? student.lastScan.toLocaleString() : "N/A"}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// export default TodayAttendance;

// THIS IS WORKING
// import React, { useState, useEffect } from "react";
// import {
//   collection,
//   query,
//   where,
//   getDocs,
//   getDoc,
//   doc,
// } from "firebase/firestore";
// import { db } from "./firebase.js";

// function TodayAttendance() {
//   const [todayAttendance, setTodayAttendance] = useState([]);
//   const [filteredAttendance, setFilteredAttendance] = useState([]);
//   const [selectedStrand, setSelectedStrand] = useState("");
//   const [selectedSection, setSelectedSection] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");

//   useEffect(() => {
//     const fetchTodayAttendance = async () => {
//       const presentStudentsQuery = query(
//         collection(db, "strands", "STEM", "1B"),
//         where("present", "==", true)
//       );
//       const presentStudentsQuerySnapshot = await getDocs(presentStudentsQuery);
//       const presentStudents = presentStudentsQuerySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         name: doc.data().name,
//         lastScan: doc.data().lastScan?.toDate() || null,
//         section: doc.data().section,
//         strand: doc.data().strand,
//       }));
//       presentStudents.sort((a, b) => b.lastScan - a.lastScan);
//       setTodayAttendance(presentStudents);
//       setFilteredAttendance(presentStudents);
//     };

//     fetchTodayAttendance();
//   }, []);

//   useEffect(() => {
//     const filteredStudents = todayAttendance.filter(
//       (student) =>
//         (!selectedStrand || student.strand === selectedStrand) &&
//         (!selectedSection || student.section === selectedSection) &&
//         (!searchQuery ||
//           student.name.toLowerCase().includes(searchQuery.toLowerCase()))
//     );
//     setFilteredAttendance(filteredStudents);
//   }, [selectedStrand, selectedSection, searchQuery, todayAttendance]);

//   const strands = [
//     ...new Set(todayAttendance.map((student) => student.strand)),
//   ];
//   const sections = [
//     ...new Set(todayAttendance.map((student) => student.section)),
//   ];

//   const handleStrandChange = (event) => {
//     setSelectedStrand(event.target.value);
//   };

//   const handleSectionChange = (event) => {
//     setSelectedSection(event.target.value);
//   };

//   const handleSearchQueryChange = (event) => {
//     setSearchQuery(event.target.value);
//   };

//   return (
//     <div className=" text-gray-700 bg-white p-8 pr-8 divide-x divide-y rounded-lg shadow-lg inline-block">
//       <h2 className="text-gray-700 text-xl font-bold mb-4">
//         Attendance For Today
//       </h2>
//       <div className="flex justify-between mb-4">
//         <div className="flex items-center">
//           <label className="text-gray-700 font-bold mr-2">Strand:</label>
//           <select
//             value={selectedStrand}
//             onChange={handleStrandChange}
//             className="border rounded-md py-1 px-2 text-gray-700"
//           >
//             <option value="">All</option>
//             {strands.map((strand) => (
//               <option key={strand} value={strand}>
//                 {strand}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div className="flex items-center">
//           <label className="text-gray-700 font-bold mr-2">Section:</label>
//           <select
//             value={selectedSection}
//             onChange={handleSectionChange}
//             className="border rounded-md py-1 px-2 text-gray-700"
//           >
//             <option value="">All</option>
//             {sections.map((section) => (
//               <option key={section} value={section}>
//                 {section}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div className="flex items-center">
//           <label className="text-gray-700 font-bold mr-2">Search:</label>
//           <input
//             type="text"
//             value={searchQuery}
//             onChange={handleSearchQueryChange}
//             className="border rounded-md py-1 px-2 text-gray-700"
//             placeholder="Search by name"
//           />
//         </div>
//       </div>
//       <div className="overflow-x-auto">
//         <table className="table-auto border-collapse w-full">
//           <thead>
//             <tr>
//               <th className="border p-2">#</th>
//               <th className="border p-2">Name</th>
//               <th className="border p-2">Strand</th>
//               <th className="border p-2">Section</th>
//               <th className="border p-2">Last Scan</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredAttendance.map((student, index) => (
//               <tr key={student.id}>
//                 <td className="border p-2">{index + 1}</td>
//                 <td className="border p-2">{student.name}</td>
//                 <td className="border p-2">{student.strand}</td>
//                 <td className="border p-2">{student.section}</td>
//                 <td className="border p-2">
//                   {student.lastScan ? student.lastScan.toLocaleString() : "N/A"}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// export default TodayAttendance;

// import { useState, useEffect } from "react";
// import { collection, query, where, getDocs } from "firebase/firestore";
// import FilterDropdown from "/components/FIlterDropdown.jsx";
// import { db } from "./firebase.js";

// function TodayAttendance() {
//   const [todayAttendance, setTodayAttendance] = useState([]);
//   const [filteredAttendance, setFilteredAttendance] = useState([]);
//   const [selectedStrand, setSelectedStrand] = useState("");
//   const [selectedSection, setSelectedSection] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");

//   useEffect(() => {
//     async function fetchData() {
//       const attendanceQuery = query(
//         collection(db, "strands", selectedStrand || "", selectedSection || "")
//       );
//       const presentStudentsQuery = query(attendanceQuery, where("present", "==", true));
//       const presentStudentsQuerySnapshot = await getDocs(presentStudentsQuery);
//       const presentStudents = presentStudentsQuerySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         name: doc.data().name,
//         lastScan: doc.data().lastScan?.toDate() || null,
//         section: doc.data().section,
//         strand: doc.data().strand,
//       }));
//       presentStudents.sort((a, b) => b.lastScan - a.lastScan);
//       setTodayAttendance(presentStudents);
//     }
//     fetchData();
//   }, [selectedStrand, selectedSection]);

//   useEffect(() => {
//     const filteredStudents = todayAttendance.filter(
//       (student) =>
//         (!selectedStrand || student.strand === selectedStrand) &&
//         (!selectedSection || student.section === selectedSection) &&
//         (!searchQuery || student.name.toLowerCase().includes(searchQuery.toLowerCase()))
//     );
//     setFilteredAttendance(filteredStudents);
//   }, [selectedStrand, selectedSection, searchQuery, todayAttendance]);

//   const strands = ["STEM", "ABM", "HUMSS", "ICT", "GAS", "ALL STRANDS"];
//   const sections = ["1A", "1B", "2A", "2B", "3A", "3B", "ALL SECTIONS"];

//   const handleFilterChange = (type, value) => {
//     if (type === "strand") {
//       setSelectedStrand(value);
//     } else if (type === "section") {
//       setSelectedSection(value);
//     } else if (type === "searchQuery") {
//       setSearchQuery(value);
//     }
//   };

//   const handleRefreshClick = async () => {
//     const attendanceQuery = query(
//       collection(db, "strands", selectedStrand || "", selectedSection || "")
//     );
//     const presentStudentsQuery = query(attendanceQuery, where("present", "==", true));
//     const presentStudentsQuerySnapshot = await getDocs(presentStudentsQuery);
//     const presentStudents = presentStudentsQuerySnapshot.docs.map((doc) => ({
//       id: doc.id,
//       name: doc.data().name,
//       lastScan: doc.data().lastScan?.toDate() || null,
//       section: doc.data().section,
//       strand: doc.data().strand,
//     }));
//     presentStudents.sort((a, b) => b.lastScan - a.lastScan);
//     setTodayAttendance(presentStudents);
//   };

//   return (
//     <div>
//       <div className="filters">
//         <FilterDropdown
//           label="Strand"
//           options={strands}
//           selected={selectedStrand}
//           onChange={(value) => handleFilterChange("strand", value)}
//           />
//         <FilterDropdown
//           label="Section"
//           options={sections}
//           selected={selectedSection}
//           onChange={(value) => handleFilterChange("section", value)}
//           />
//         <div className="search">
//           <input
//             type="text"
//             placeholder="Search"
//             value={searchQuery}
//             onChange={(e) => handleFilterChange("searchQuery", e.target.value)}
//           />
//           <i className="fas fa-search"></i>
//         </div>
//         <button className="refresh" onClick={handleRefreshClick}>
//           <i className="fas fa-sync"></i>
//         </button>
//       </div>
//       <div className="attendance-list">
//         {filteredAttendance.map((student) => (
//           <StudentAttendance key={student.id} student={student} />
//         ))}
//         {filteredAttendance.length === 0 && (
//           <p className="no-results">No results found.</p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default TodayAttendance;

// import React, { useState, useEffect } from "react";
// import {
//   collection,
//   query,
//   where,
//   getDocs,
//   getDoc,
//   doc,
// } from "firebase/firestore";
// import { db } from "./firebase.js";

// function TodayAttendance() {
//   const [todayAttendance, setTodayAttendance] = useState([]);
//   const [filteredAttendance, setFilteredAttendance] = useState([]);
//   const [selectedStrand, setSelectedStrand] = useState("");
//   const [selectedSection, setSelectedSection] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");

//   useEffect(() => {
//     const fetchTodayAttendance = async () => {
//       let attendanceQuery;

//       if (selectedStrand && selectedSection) {
//         attendanceQuery = query(collection(db, "strands", selectedStrand, selectedSection));
//       } else if (selectedStrand) {
//         attendanceQuery = query(collection(db, "strands", selectedStrand));
//       } else {
//         attendanceQuery = query(collection(db, "strands"));
//       }

//       const presentStudentsQuery = query(attendanceQuery, where("present", "==", true));
//       const presentStudentsQuerySnapshot = await getDocs(presentStudentsQuery);
//       const presentStudents = presentStudentsQuerySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         name: doc.data().name,
//         lastScan: doc.data().lastScan?.toDate() || null,
//         section: doc.data().section,
//         strand: doc.data().strand,
//       }));
//       presentStudents.sort((a, b) => b.lastScan - a.lastScan);
//       setTodayAttendance(presentStudents);
//       setFilteredAttendance(presentStudents);
//     };

//     fetchTodayAttendance();
//   }, [selectedStrand, selectedSection]);

//   useEffect(() => {
//     const filteredStudents = todayAttendance.filter(
//       (student) =>
//         (!selectedStrand || student.strand === selectedStrand) &&
//         (!selectedSection || student.section === selectedSection) &&
//         (!searchQuery ||
//           student.name.toLowerCase().includes(searchQuery.toLowerCase()))
//     );
//     setFilteredAttendance(filteredStudents);
//   }, [selectedStrand, selectedSection, searchQuery, todayAttendance]);

//   const strands = ["STEM", "ABM", "HUMSS", "ICT", "GAS", "ALL STRANDS"];
//   const sections = ["1A", "1B", "2A", "2B", "3A", "3B", "ALL SECTIONS"];

//   const handleStrandChange = (event) => {
//     const selectedStrand = event.target.value;
//     setSelectedStrand(selectedStrand);

//     const filteredStudents = todayAttendance.filter(
//       (student) =>
//         (selectedStrand === "ALL STRANDS" || student.strand === selectedStrand) &&
//         (selectedSection === "ALL SECTIONS" || student.section === selectedSection) &&
//         (!searchQuery ||
//           student.name.toLowerCase().includes(searchQuery.toLowerCase()))
//     );
//     setFilteredAttendance(filteredStudents);
//   };

//   const handleSectionChange = (event) => {
//     const selectedSection = event.target.value;
//     setSelectedSection(selectedSection);

//     const filteredStudents = todayAttendance.filter(
//       (student) =>
//         (selectedStrand === "ALL STRANDS" || student.strand === selectedStrand) &&
//         (selectedSection === "ALL SECTIONS" || student.section === selectedSection) &&
//         (!searchQuery ||
//           student.name.toLowerCase().includes(searchQuery.toLowerCase()))
//     );
//     setFilteredAttendance(filteredStudents);
//   };

//   const handleSearchQueryChange = (event) => {
//     setSearchQuery(event.target.value);
//   };

//   const handleRefreshClick = async () => {
//     const attendanceQuery = query(
//       collection(db, "strands", selectedStrand, selectedSection)
//     );
//     const presentStudentsQuery = query(attendanceQuery, where("present", "==", true));
//     const presentStudentsQuerySnapshot = await getDocs(presentStudentsQuery);
//     const presentStudents = presentStudentsQuerySnapshot.docs.map((doc) => ({
//       id: doc.id,
//       name: doc.data().name,
//       lastScan: doc.data().lastScan?.toDate() || null,
//       section: doc.data().section,
//       strand: doc.data().strand,
//     }));
//     presentStudents.sort((a, b) => b.lastScan - a.lastScan);
//     setTodayAttendance(presentStudents);
//     setFilteredAttendance(presentStudents);
//   };

//   return (
//     <div className="text-gray-700 bg-white p-8 pr-8 divide-x divide-y rounded-lg shadow-lg inline-block">
//       <h2 className="text-gray-700 text-xl font-bold mb-4">
//         Attendance For Today
//       </h2>
//       <div className="flex justify-between mb-4">
//         <div className="flex items-center">
//           <label className="text-gray-700 font-bold mr-2">Strand:</label>
//           <select
//             value={selectedStrand}
//             onChange={handleStrandChange}
//             className="border rounded-md py-1 px-2 text-gray-700"
//           >
//             <option value="">All</option>
//             {strands.map((strand) => (
//               <option key={strand} value={strand}>
//                 {strand}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div className="flex items-center">
//           <label className="text-gray-700 font-bold mr-2">Section:</label>
//           <select
//             value={selectedSection}
//             onChange={handleSectionChange}
//             className="border rounded-md py-1 px-2 text-gray-700"
//           >
//             <option value="">All</option>
//             {sections.map((section) => (
//               <option key={section} value={section}>
//                 {section}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div className="flex items-center">
//           <label className="text-gray-700 font-bold mr-2">Search:</label>
//           <input
//             type="text"
//             value={searchQuery}
//             onChange={handleSearchQueryChange}
//             className="border rounded-md py-1 px-2 text-gray-700"
//             placeholder="Search by name"
//           />
//         </div>
//       </div>
//       <div className="overflow-x-auto">
//         <table className=" table-auto border-collapse w-full">
//           <thead>
//             <tr>
//               <th className="border p-2">#</th>
//               <th className="border p-2">Name</th>
//               <th className="border p-2">Strand</th>
//               <th className="border p-2">Section</th>
//               <th className="border p-2">Last Scan</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredAttendance.map((student, index) => (
//               <tr key={student.id}>
//                 <td className="border p-2">{index + 1}</td>
//                 <td className="border p-2">{student.name}</td>
//                 <td className="border p-2">{student.strand}</td>
//                 <td className="border p-2">{student.section}</td>
//                 <td className="border p-2">
//                   {student.lastScan ? student.lastScan.toLocaleString() : "N/A"}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         <div className="flex items-center">
//           <button
//             onClick={handleRefreshClick}
//             className="border rounded-md py-1 px-2 text-gray-700 ml-4"
//           >
//             Refresh
//           </button>
//         </div>
//       </div>
//     </div>

//   );
// }

// export default TodayAttendance;

// import React, { useState, useEffect } from "react";
// import {
//   collection,
//   query,
//   where,
//   getDocs,
//   getDoc,
//   doc,
// } from "firebase/firestore";
// import { db } from "./firebase.js";

// function TodayAttendance() {
//   const [todayAttendance, setTodayAttendance] = useState([]);

//   useEffect(() => {
//     const fetchTodayAttendance = async () => {
//       const presentStudentsQuery = query(
//         collection(db, "strands", "STEM", "1B"),
//         where("present", "==", true)
//       );
//       const presentStudentsQuerySnapshot = await getDocs(presentStudentsQuery);
//       const presentStudents = presentStudentsQuerySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         name: doc.data().name,
//         lastScan: doc.data().lastScan?.toDate() || null,
//         section: doc.data().section,
//       }));
//       presentStudents.sort((a, b) => b.lastScan - a.lastScan);
//       setTodayAttendance(presentStudents);
//     };

//     fetchTodayAttendance();
//   }, []);

// return (
//   <div className="bg-white p-8 pr-8 divide-x divide-y rounded-lg shadow-lg inline-block">
//     <h2 className="text-gray-700 text-xl font-bold mb-4">Attendance For Today</h2>
//     <table className="divide-y divide-gray-200 border border-gray-300 rounded-md">
//       <thead className="bg-gray-50">
//         <tr>
//           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//             Name
//           </th>
//           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//             Last Scan
//           </th>
//           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//             Section
//           </th>
//         </tr>
//       </thead>
//       <tbody className="bg-white divide-y divide-gray-200">
//         {todayAttendance.map((student) => (
//           <tr key={student.id}>
//             <td className="px-6 py-4 whitespace-nowrap">
//               <div className="flex items-center">
//                 <div className="ml-4">
//                   <div className="text-sm font-medium text-gray-900">{student.name}</div>
//                 </div>
//               </div>
//             </td>
//             <td className="px-6 py-4 whitespace-nowrap">
//               <div className="text-sm text-gray-900">
//                 {student.lastScan ? student.lastScan.toLocaleTimeString() : "No Record"}
//               </div>
//             </td>
//             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.section}</td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   </div>
// );

// }

// export default TodayAttendance;

// import React, { useState, useEffect } from "react";
// import {
//   collection,
//   query,
//   where,
//   getDocs,
//   getDoc,
//   doc,
// } from "firebase/firestore";
// import { db } from "./firebase.js";

// function TodayAttendanceViewer() {
//   const [todayAttendance, setTodayAttendance] = useState([]);
//   const [pastAttendance, setPastAttendance] = useState([]);
//   const [selectedDate, setSelectedDate] = useState(new Date());

//   useEffect(() => {
//     const fetchTodayAttendance = async () => {
//       const presentStudentsQuery = query(
//         collection(db, "students"),
//         where("present", "==", true)
//       );
//       const presentStudentsQuerySnapshot = await getDocs(presentStudentsQuery);
//       const presentStudents = presentStudentsQuerySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         name: doc.data().name,
//         lastScan: doc.data().lastScan?.toDate() || null,
//       }));
//       presentStudents.sort((a, b) => b.lastScan - a.lastScan);
//       setTodayAttendance(presentStudents);
//     };

//     fetchTodayAttendance();
//   }, []);

//   useEffect(() => {
//     const fetchPastAttendance = async () => {
//       const dateStr = selectedDate.toISOString().slice(0, 10);
//       const attendanceDocRef = doc(db, "presentStudents", dateStr);
//       const attendanceDocSnapshot = await getDoc(attendanceDocRef);
//       if (attendanceDocSnapshot.exists()) {
//         const attendanceData = attendanceDocSnapshot.data();
//         const presentStudents = attendanceData.presentStudents.map(
//           (student) => ({
//             ...student,
//             lastScan: student.lastScan.toDate(),
//           })
//         );
//         presentStudents.sort((a, b) => b.lastScan - a.lastScan);
//         setPastAttendance(presentStudents);
//       } else {
//         setPastAttendance([]);
//       }
//     };

//     fetchPastAttendance();
//   }, [selectedDate]);

//   const handleDateChange = (event) => {
//     const date = new Date(event.target.value);
//     setSelectedDate(date);
//   };

//   return (
//     <div>
//       <div>
//         <h2>Today's Attendance</h2>
//         <ul>
//           {todayAttendance.map((student) => (
//             <li key={student.id}>
//               {student.name} - {student.lastScan?.toLocaleTimeString()} -{" "}
//               {student.id}
//             </li>
//           ))}
//         </ul>
//       </div>
//       <div>
//         <h2>Past Attendance</h2>
//         <label htmlFor="attendanceDate">Select a date:</label>
//         <input
//           type="date"
//           id="attendanceDate"
//           value={selectedDate.toISOString().slice(0, 10)}
//           onChange={handleDateChange}
//         />
//         <ul>
//           {pastAttendance.map((student) => (
//             <li key={student.id}>
//               {student.name} -{" "}
//               {student.lastScan instanceof Date &&
//                 student.lastScan.toLocaleTimeString()}{" "}
//               - {student.id}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }

// export default TodayAttendanceViewer;

{
  /* <p className="text-xl font-bold mt-6">Scan result:</p>
<p className="text-xl">{data}</p>
<h1 className="text-3xl font-semibold mt-8">Recent Logs</h1>
<div className="bg-white rounded-lg shadow-lg mt-6 w-full max-w-md">
  <ul className="text-gray-700 divide-y divide-gray-300">
    {log.map((entry, index) => (
      <li key={entry.id} className="py-4 px-6">
        <span className="block font-semibold">{entry.info}</span>
      </li>
    ))}
  </ul>
</div>
</div>
); */
}
