import { EuiCard, EuiFlexGroup, EuiFlexItem, EuiImage } from "@elastic/eui";

import React from "react";
import { useNavigate } from "react-router-dom";
import meeting1 from "./assets/meeting1.png";
import meeting2 from "./assets/meeting2.png";
import * as Components from "../../components/all";

// import Header from "../components/Header";
// import useAuth from "../hooks/useAuth";

export default function CreateMeeting() {
  // useAuth();
  const navigate = useNavigate();

  return (
    <>
      <div className="AdminProfile bg-[#F7F9FF] flex items-stretch h-screen max-h-screen overflow-hidden">
        {/* Sidebar */}
        <Components.Sidebar page={"zoom"} />

        {/* Right */}
        <div className="flex-1 flex flex-col items-stretch overflow-hidden">
          {/* Navbar */}
          <Components.AdminNavbar page={"Zoom Session"} />
          {/* Page */}
          <div className="p-4 flex-1 h-full overflow-auto text-start">
            {/* heading */}
            <Components.Paragraph className="font-bold mt-5">
              BreadCrumbs (6)
            </Components.Paragraph>


          </div>
        </div>
      <div
        style={{
          display: "flex",
          height: "100vh",
          flexDirection: "column",
        }}
        >
        {/* <Header /> */}
        <EuiFlexGroup
          justifyContent="center"
          alignItems="center"
          style={{ margin: "5vh 10vw" }}
          >
          <EuiFlexItem>
            <EuiCard
              icon={<EuiImage src={meeting1} alt="icon" size="100%" />}
              title={`Create 1 on 1 Meeting`}
              description="Create a personal single person meeting."
              onClick={() => navigate("/create1on1")}
              paddingSize="xl"
              />
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiCard
              icon={<EuiImage src={meeting2} alt="icon" size="100%" />}
              title={`Create Video Conference`}
              description="Invite multiple persons to the meeting."
              onClick={() => navigate("/videoconference")}
              paddingSize="xl"
              />
          </EuiFlexItem>
        </EuiFlexGroup>
      </div>
      </div>
    </>
  );
}
