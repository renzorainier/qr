import Head from "next/head";
import { useState } from "react";
import Scan from "components/Scan";
import PastAttendance from "/components/PastView";
import TodayAttendance from "/components/TodayView";
import SavePresentStudents from "components/Save";
import Generate from "components/Generate";
import { useEffect } from "react";
import StudentCollection from "components/Create";
import TabSelector from "components/Tab";

export default function Home() {
  const [component, setComponent] = useState("");

  const handleClick = (event) => {
    setComponent(event.target.value);
  };

  const renderComponent = () => {
    switch (component) {
      case "Scan":
        return <Scan />;
      case "TodayAttendance":
        return <TodayAttendance />;
      case "PastAttendance":
        return <PastAttendance />;
      case "Save":
        return <SavePresentStudents />;
      case "Generate":
        return <Generate />;
      case "Create":
        return <StudentCollection />;
      case "Tab":
        return <TabSelector />;
      default:
        return (
          <>
            <h1 className="text-4xl font-bold mb-4 text-white">
              Welcome to Scas Attendance Viewer
            </h1>
            <p className="text-lg mb-6 text-white">Choose Below</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                value="Tab"
                className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                onClick={handleClick}
              >
                Attendance
              </button>
              {/* <button
                value="TodayAttendance"
                className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                onClick={handleClick}
              >
                Attendance for Today
              </button> */}

              {/* <button
                value="PastAttendance"
                className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                onClick={handleClick}
              >
                Past Attendance
              </button> */}

              <button
                value="Scan"
                className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                onClick={handleClick}
              >
                Scan
              </button>
              {/* <button
                value="Save"
                className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                onClick={handleClick}
              >
                Save
              </button> */}
              <button
                value="Generate"
                className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                onClick={handleClick}
              >
                Create
              </button>
              <button
                value="Create"
                className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                onClick={handleClick}
              >
                Update Data
              </button>
            </div>
          </>
        );
    }
  };

  useEffect(() => {
    // Remove the server-side injected CSS to avoid color flickering
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Qr App | Renz Pasagdan</title>
        <meta name="description" content="Welcome to Scas Attendance Scan" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Urbanist:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400&amp;display=swap"
          rel="stylesheet"
        />
      </Head>
      <main className="container mx-auto ">{renderComponent()}</main>
      <div></div>
    </>
  );
}
