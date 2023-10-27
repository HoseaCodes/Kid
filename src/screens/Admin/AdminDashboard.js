import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import * as Components from "../../components/all";
// chart
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Filler,
	Legend,
	ArcElement,
	BarElement,
} from "chart.js";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import Reader from "../../components/Icons/Reader";
import Teacher from "../../components/Icons/Teacher";
import Group from "../../components/Icons/Group";
import Progression from "../../components/Icons/Progression";
import { barData, barOptions, lineData, lineOptions, doughnutOptions, doughnutData,
	studentLineOptions, studentDoughnutData, studentBarData} from "../../utils/chartJsOptions";
import Student from "../../components/Icons/Student";
import Earnings from "../../components/Icons/Earnings";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	ArcElement,
	BarElement,
	Title,
	Tooltip,
	Filler,
	Legend
);

export default function AdminDashboard({childern}) {
	console.log(childern)
	const [user, setUser] = useState({
		// uid: props.user.uid,
        // name: props.user.displayName,
        // phone: props.user.phoneNumber,
        // avatar: props.user.photoURL,
        authProvider: "local",
        // email: props.user.email,
        username: "",
        phone: "",
        isAdmin: false,
        isTeacher: false,
        isStudent: true,
        pendingCourses: [],
        cart: {},
        courses: [],
        transactions: [],
		assessments: [],
		announcements: {
			student: [
				{
					msg: "School Meeting will be held on thursday 2 pm",
					from: "HR Manager",
					sinceCreation: "12 min ago",
					createdAt: "12 june 2023"
				}],
			faculty: ["School Meeting will be held on thursday 2 pm"],
			teacher: ["School Meeting will be held on thursday 2 pm"],
		},
		tutoringSessions: []
	});

	const [name, setName] = useState("");
	const navigate = useNavigate();

	// const fetchUserName = async () => {
	// 	try {
	// 	const q = query(collection(db, "users"), where("uid", "==", props.user?.uid));
	// 	const doc = await getDocs(q);
	// 	const data = doc.docs[0].data();
	// 	setUser(data)
	// 	setName(data.name);
	// 	} catch (err) {
	// 	console.error(err);
	// 	alert("An error occured while fetching user data");
	// 	}
	// };
	
	// useEffect(() => {
	// 	// if (!props.user) return navigate("/login");
	// 	// fetchUserName();
	// }, [props.user]);

	const isStudent = () => {
		const gradeData = {
			labels: [
				"Jan",
				"Feb",
				"Mar",
				"Apr",
				"May",
				"Jun",
				"Jul",
				"Aug",
				"Sep",
				"Oct",
				"Nov",
				"Dec",
			],
			datasets: [
				{
					fill: false,
					lineTension: 0.5,
					data: [
						75, 90, 80, 85, 90, 86, 88, 92, 96, 84, 83,
						96,
					],
					borderColor: "#F38315",
					backgroundColor: "rgba(255, 255, 255, 1)",
					borderWidth: 2,
				},
				{
					fill: false,
					lineTension: 0.5,
					data: [
						80, 83, 83, 84, 89, 89, 100, 80, 88, 92, 93,
						93,
					],
					borderColor: "#C33B4C",
					backgroundColor: "rgba(255, 255, 255, 1)",
					borderWidth: 2,
				},
			],
		};
		return (
			<>
				{/* cards row */}
				<div className="mt-4 flex justify-between flex-wrap">
					{/* cards */}
					<div className="h-28 flex w-full xl:w-[50%] mt-4">
						<div className="h-full flex-1 bg-white flex p-4 rounded-md shadow">
							{/* left */}
							<div className="flex-col items-start text-left h-full">
								<Components.Paragraph className="!font-[Grandstander]">
									Total Classes
								</Components.Paragraph>
								<Components.Paragraph className="!font-[Grandstander] !text-xl mt-5">
									{user.courses ? user.courses.length : 0}
								</Components.Paragraph>
							</div>
							{/* right */}
							<Reader />
						</div>
						<div className="h-full ml-3 flex-1 bg-white flex p-4 rounded-md shadow">
							{/* left */}
							<div className="flex-col items-start text-left h-full">
								<Components.Paragraph className="!font-[Grandstander]">
									Total Assessments
								</Components.Paragraph>

								<Components.Paragraph className="!font-[Grandstander] !text-xl mt-5">
									{user.assessments ? user.assessments.length : 0}
								</Components.Paragraph>
							</div>
							{/* right */}
							<Teacher />
						</div>
					</div>

					{/* cards */}
					<div className="h-28 flex w-full xl:w-[50%] mt-3 xl:mt-4">
						<div className="h-full xl:ml-3 flex-1 bg-white flex p-4 rounded-md shadow">
							{/* left */}
							<div className="flex-col items-start text-left h-full">
								<Components.Paragraph className="!font-[Grandstander]">
									Total Tutoring Sessions
								</Components.Paragraph>
								<Components.Paragraph className="!font-[Grandstander] !text-xl mt-5">
									{user.tutoringSessions ? user.tutoringSessions : 0}
								</Components.Paragraph>
							</div>

							{/* right */}
							<Group />		
						</div>
					</div>
				</div>

				{/* graphs row */}
				<div className="mt-4 flex justify-between flex-wrap">
					{/* left card */}
					<div className="h-96 w-full xl:w-[60%] mt-4 bg-white flex flex-col p-4 rounded-md shadow">
						{/* heading and select */}
						<div className="flex justify-between">
							<Components.Paragraph className="!text-lg !font-bold">
								Course Progress
							</Components.Paragraph>

							<select
								name=""
								id=""
								className="focus:outline-none border border-[#A7AFB2] p-2 rounded text-sm text-[#A7AFB2]"
							>
								<option value="">Filter</option>
							</select>
						</div>
						{/* graph */}
						<div className="flex flex-col flex-1 w-full overflow-hidden">
							{/* top */}
							<div className="flex mb-5">
								<Components.Paragraph className="!text-sm !text-[#474747]">
									This week
								</Components.Paragraph>
									<Progression />
								<Components.Paragraph className="!text-sm !text-[#474747]">
									430k
								</Components.Paragraph>
							</div>

							{/* bottom */}
							<div className="flex-1 w-full overflow-hidden">
								<Line
									options={studentLineOptions}
									data={gradeData}
									style={{ width: "100%", height: "100%" }}
								/>
							</div>
						</div>
					</div>

					{/* right card */}
					<div className="h-96 w-full xl:w-auto flex-1 mt-3 xl:mt-4 xl:ml-4 bg-white flex flex-col p-4 rounded-md shadow">
						{/* heading and select */}
						<div className="flex justify-between">
							<Components.Paragraph className="!text-lg !font-bold">
								Classes
							</Components.Paragraph>
						</div>

						{/* graph */}
						<div className="flex flex-col items-center justify-center flex-1 w-full overflow-hidden">
							{/* bottom */}
							<div className="relative flex-1 w-full overflow-hidden flex items-center justify-center">
								<Doughnut options={doughnutOptions} data={studentDoughnutData} />

								<div className="absolute text-center font-medium text-xl mb-7">
									Current Classes <br /> {user.courses ? user.courses.length : 0} <br />
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* bottom row */}
				<div className="mt-4 flex justify-between flex-wrap">
					{/* left card */}
					<div className="h-96 w-full xl:w-[60%] mt-4 bg-white flex flex-col p-4 rounded-md shadow">
						{/* heading and select */}
						<div className="flex justify-between mb-2">
							<Components.Paragraph className="!text-lg !font-bold">
								Notice board
							</Components.Paragraph>
							<select
								name=""
								id=""
								className="focus:outline-none border border-[#A7AFB2] p-2 rounded text-sm text-[#A7AFB2]"
							>
								<option value="">Filter</option>
							</select>
						</div>
						{/* cards */}
						<div className="flex flex-col flex-1 w-full overflow-hidden">
							{ user.announcements.student || user.announcements.student !== undefined ? 
							user.announcements.student.map((announcement) => (
							<div className="flex items-center p-2">
								<Student/>
								<div className="flex flex-col items-start px-3">
									<Components.Paragraph>
											{announcement.msg}
										</Components.Paragraph>
									<Components.Paragraph
										className={"text-[#A7AFB2] !text-sm mt-1"}
									>
										{announcement.from} Upload {announcement.sinceCreation}
									</Components.Paragraph>
								</div>
									<div className="p-2 px-5 bg-[#A7AFB2] ml-auto rounded-full text-[#C33B4C] bg-opacity-40">
										{announcement.createdAt} 
									</div>
								</div>
							))
								:
							<>
								No Announcements
							</>
						}
						</div>
					</div>

					{/* right card */}
					<div className="h-96 w-full xl:w-auto flex-1 mt-3 xl:mt-4 xl:ml-4 bg-white flex flex-col p-4 rounded-md shadow">
						{/* heading and select */}
						<div className="flex justify-between mb-2">
							<Components.Paragraph className="!text-lg !font-bold">
								Statistics
							</Components.Paragraph>
							<select
								name=""
								id=""
								className="focus:outline-none border border-[#A7AFB2] p-2 rounded text-sm text-[#A7AFB2]"
							>
								<option value="">Filter</option>
							</select>
						</div>
						{/* graph */}
						<div className="flex flex-col items-center justify-center flex-1 w-full overflow-hidden mt-3">
							{/* bottom */}
							<div className="flex-1 w-full overflow-hidden flex items-center justify-center">
								<Bar options={barOptions} data={studentBarData} />
							</div>
						</div>
					</div>
				</div>
			</>
		)
	}

	const isAdmin = () => {
		return (
			<>
				{/* cards row */}
				<div className="mt-4 flex justify-between flex-wrap">
					{/* cards */}
					<div className="h-28 flex w-full xl:w-[50%] mt-4">
						<div className="h-full flex-1 bg-white flex p-4 rounded-md shadow">
							{/* left */}
							<div className="flex-col items-start text-left h-full">
								<Components.Paragraph className="!font-[Grandstander]">
									Total Students
								</Components.Paragraph>

								<Components.Paragraph className="!font-[Grandstander] !text-xl mt-5">
									1000+
								</Components.Paragraph>
							</div>

							{/* right */}
							<Reader/>
						</div>

						<div className="h-full ml-3 flex-1 bg-white flex p-4 rounded-md shadow">
							{/* left */}
							<div className="flex-col items-start text-left h-full">
								<Components.Paragraph className="!font-[Grandstander]">
									Total Teacher
								</Components.Paragraph>

								<Components.Paragraph className="!font-[Grandstander] !text-xl mt-5">
									1000+
								</Components.Paragraph>
							</div>

							{/* right */}
							<Teacher />
						</div>
					</div>

					{/* cards */}
					<div className="h-28 flex w-full xl:w-[50%] mt-3 xl:mt-4">
						<div className="h-full xl:ml-3 flex-1 bg-white flex p-4 rounded-md shadow">
							{/* left */}
							<div className="flex-col items-start text-left h-full">
								<Components.Paragraph className="!font-[Grandstander]">
									Total Parents
								</Components.Paragraph>

								<Components.Paragraph className="!font-[Grandstander] !text-xl mt-5">
									1000+
								</Components.Paragraph>
							</div>

							{/* right */}
							<Group />
						</div>

						<div className="h-full ml-3 flex-1 bg-white flex p-4 rounded-md shadow">
							{/* left */}
							<div className="flex-col items-start text-left h-full">
								<Components.Paragraph className="!font-[Grandstander]">
									Total Earning
								</Components.Paragraph>

								<Components.Paragraph className="!font-[Grandstander] !text-xl mt-5">
									1000+
								</Components.Paragraph>
							</div>

							{/* right */}
							<Earnings />
						</div>
					</div>
				</div>

				{/* graphs row */}
				<div className="mt-4 flex justify-between flex-wrap">
					{/* left card */}
					<div className="h-96 w-full xl:w-[60%] mt-4 bg-white flex flex-col p-4 rounded-md shadow">
						{/* heading and select */}
						<div className="flex justify-between">
							<Components.Paragraph className="!text-lg !font-bold">
								Total Earnings
							</Components.Paragraph>

							<select
								name=""
								id=""
								className="focus:outline-none border border-[#A7AFB2] p-2 rounded text-sm text-[#A7AFB2]"
							>
								<option value="">Filter</option>
							</select>
						</div>

						{/* graph */}
						<div className="flex flex-col flex-1 w-full overflow-hidden">
							{/* top */}
							<div className="flex mb-5">
								<Components.Paragraph className="!text-sm !text-[#474747]">
									This week
								</Components.Paragraph>
								<Progression />
								<Components.Paragraph className="!text-sm !text-[#474747]">
									430k
								</Components.Paragraph>
							</div>

							{/* bottom */}
							<div className="flex-1 w-full overflow-hidden">
								<Line
									options={lineOptions}
									data={lineData}
									style={{ width: "100%", height: "100%" }}
								/>
							</div>
						</div>
					</div>

					{/* right card */}
					<div className="h-96 w-full xl:w-auto flex-1 mt-3 xl:mt-4 xl:ml-4 bg-white flex flex-col p-4 rounded-md shadow">
						{/* heading and select */}
						<div className="flex justify-between">
							<Components.Paragraph className="!text-lg !font-bold">
								Students
							</Components.Paragraph>
						</div>

						{/* graph */}
						<div className="flex flex-col items-center justify-center flex-1 w-full overflow-hidden">
							{/* bottom */}
							<div className="relative flex-1 w-full overflow-hidden flex items-center justify-center">
								<Doughnut options={doughnutOptions} data={doughnutData} />

								<div className="absolute text-center font-medium text-xl mb-7">
									Total <br /> 70,000 <br />+
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* bottom row */}
				<div className="mt-4 flex justify-between flex-wrap">
					{/* left card */}
					<div className="h-96 w-full xl:w-[60%] mt-4 bg-white flex flex-col p-4 rounded-md shadow">
						{/* heading and select */}
						<div className="flex justify-between mb-2">
							<Components.Paragraph className="!text-lg !font-bold">
								Notice board
							</Components.Paragraph>

							<select
								name=""
								id=""
								className="focus:outline-none border border-[#A7AFB2] p-2 rounded text-sm text-[#A7AFB2]"
							>
								<option value="">Filter</option>
							</select>
						</div>

						{/* cards */}
						<div className="flex flex-col flex-1 w-full overflow-hidden">
							{[1, 2, 3, 4, 5].map((x) => (
								<div className="flex items-center p-2">
									<Student />
									<div className="flex flex-col items-start px-3">
										<Components.Paragraph>
											School Meeting will be held on thursday 2 pm
										</Components.Paragraph>

										<Components.Paragraph
											className={"text-[#A7AFB2] !text-sm mt-1"}
										>
											HR Manager Upload 12 min ago
										</Components.Paragraph>
									</div>

									<div className="p-2 px-5 bg-[#A7AFB2] ml-auto rounded-full text-[#C33B4C] bg-opacity-40">
										12 june 2023
									</div>
								</div>
							))}
						</div>
					</div>

					{/* right card */}
					<div className="h-96 w-full xl:w-auto flex-1 mt-3 xl:mt-4 xl:ml-4 bg-white flex flex-col p-4 rounded-md shadow">
						{/* heading and select */}
						<div className="flex justify-between mb-2">
							<Components.Paragraph className="!text-lg !font-bold">
								Statistics
							</Components.Paragraph>

							<select
								name=""
								id=""
								className="focus:outline-none border border-[#A7AFB2] p-2 rounded text-sm text-[#A7AFB2]"
							>
								<option value="">Filter</option>
							</select>
						</div>

						{/* graph */}
						<div className="flex flex-col items-center justify-center flex-1 w-full overflow-hidden mt-3">
							{/* bottom */}
							<div className="flex-1 w-full overflow-hidden flex items-center justify-center">
								<Bar options={barOptions} data={barData} />
							</div>
						</div>
					</div>
				</div>
			</>
		)
	}

	const isTeacher = () => {
		return (
			<>
				{/* cards row */}
				<div className="mt-4 flex justify-between flex-wrap">
					{/* cards */}
					<div className="h-28 flex w-full xl:w-[50%] mt-4">
						<div className="h-full flex-1 bg-white flex p-4 rounded-md shadow">
							{/* left */}
							<div className="flex-col items-start text-left h-full">
								<Components.Paragraph className="!font-[Grandstander]">
									Total Students
								</Components.Paragraph>

								<Components.Paragraph className="!font-[Grandstander] !text-xl mt-5">
									1000+
								</Components.Paragraph>
							</div>

							{/* right */}
							<Reader/>
						</div>

						<div className="h-full ml-3 flex-1 bg-white flex p-4 rounded-md shadow">
							{/* left */}
							<div className="flex-col items-start text-left h-full">
								<Components.Paragraph className="!font-[Grandstander]">
									Total Teacher
								</Components.Paragraph>

								<Components.Paragraph className="!font-[Grandstander] !text-xl mt-5">
									1000+
								</Components.Paragraph>
							</div>

							{/* right */}
							<Teacher />
						</div>
					</div>

					{/* cards */}
					<div className="h-28 flex w-full xl:w-[50%] mt-3 xl:mt-4">
						<div className="h-full xl:ml-3 flex-1 bg-white flex p-4 rounded-md shadow">
							{/* left */}
							<div className="flex-col items-start text-left h-full">
								<Components.Paragraph className="!font-[Grandstander]">
									Total Parents
								</Components.Paragraph>

								<Components.Paragraph className="!font-[Grandstander] !text-xl mt-5">
									1000+
								</Components.Paragraph>
							</div>

							{/* right */}
							<Group />
						</div>

						<div className="h-full ml-3 flex-1 bg-white flex p-4 rounded-md shadow">
							{/* left */}
							<div className="flex-col items-start text-left h-full">
								<Components.Paragraph className="!font-[Grandstander]">
									Total Earning
								</Components.Paragraph>

								<Components.Paragraph className="!font-[Grandstander] !text-xl mt-5">
									1000+
								</Components.Paragraph>
							</div>

							{/* right */}
							<Earnings />
						</div>
					</div>
				</div>

				{/* graphs row */}
				<div className="mt-4 flex justify-between flex-wrap">
					{/* left card */}
					<div className="h-96 w-full xl:w-[60%] mt-4 bg-white flex flex-col p-4 rounded-md shadow">
						{/* heading and select */}
						<div className="flex justify-between">
							<Components.Paragraph className="!text-lg !font-bold">
								Total Earnings
							</Components.Paragraph>

							<select
								name=""
								id=""
								className="focus:outline-none border border-[#A7AFB2] p-2 rounded text-sm text-[#A7AFB2]"
							>
								<option value="">Filter</option>
							</select>
						</div>

						{/* graph */}
						<div className="flex flex-col flex-1 w-full overflow-hidden">
							{/* top */}
							<div className="flex mb-5">
								<Components.Paragraph className="!text-sm !text-[#474747]">
									This week
								</Components.Paragraph>
								<Progression />
								<Components.Paragraph className="!text-sm !text-[#474747]">
									430k
								</Components.Paragraph>
							</div>

							{/* bottom */}
							<div className="flex-1 w-full overflow-hidden">
								<Line
									options={lineOptions}
									data={lineData}
									style={{ width: "100%", height: "100%" }}
								/>
							</div>
						</div>
					</div>

					{/* right card */}
					<div className="h-96 w-full xl:w-auto flex-1 mt-3 xl:mt-4 xl:ml-4 bg-white flex flex-col p-4 rounded-md shadow">
						{/* heading and select */}
						<div className="flex justify-between">
							<Components.Paragraph className="!text-lg !font-bold">
								Students
							</Components.Paragraph>
						</div>

						{/* graph */}
						<div className="flex flex-col items-center justify-center flex-1 w-full overflow-hidden">
							{/* bottom */}
							<div className="relative flex-1 w-full overflow-hidden flex items-center justify-center">
								<Doughnut options={doughnutOptions} data={doughnutData} />

								<div className="absolute text-center font-medium text-xl mb-7">
									Total <br /> 70,000 <br />+
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* bottom row */}
				<div className="mt-4 flex justify-between flex-wrap">
					{/* left card */}
					<div className="h-96 w-full xl:w-[60%] mt-4 bg-white flex flex-col p-4 rounded-md shadow">
						{/* heading and select */}
						<div className="flex justify-between mb-2">
							<Components.Paragraph className="!text-lg !font-bold">
								Notice board
							</Components.Paragraph>

							<select
								name=""
								id=""
								className="focus:outline-none border border-[#A7AFB2] p-2 rounded text-sm text-[#A7AFB2]"
							>
								<option value="">Filter</option>
							</select>
						</div>

						{/* cards */}
						<div className="flex flex-col flex-1 w-full overflow-hidden">
							{[1, 2, 3, 4, 5].map((x) => (
								<div className="flex items-center p-2">
									<Student />
									<div className="flex flex-col items-start px-3">
										<Components.Paragraph>
											School Meeting will be held on thursday 2 pm
										</Components.Paragraph>

										<Components.Paragraph
											className={"text-[#A7AFB2] !text-sm mt-1"}
										>
											HR Manager Upload 12 min ago
										</Components.Paragraph>
									</div>

									<div className="p-2 px-5 bg-[#A7AFB2] ml-auto rounded-full text-[#C33B4C] bg-opacity-40">
										12 june 2023
									</div>
								</div>
							))}
						</div>
					</div>

					{/* right card */}
					<div className="h-96 w-full xl:w-auto flex-1 mt-3 xl:mt-4 xl:ml-4 bg-white flex flex-col p-4 rounded-md shadow">
						{/* heading and select */}
						<div className="flex justify-between mb-2">
							<Components.Paragraph className="!text-lg !font-bold">
								Statistics
							</Components.Paragraph>

							<select
								name=""
								id=""
								className="focus:outline-none border border-[#A7AFB2] p-2 rounded text-sm text-[#A7AFB2]"
							>
								<option value="">Filter</option>
							</select>
						</div>

						{/* graph */}
						<div className="flex flex-col items-center justify-center flex-1 w-full overflow-hidden mt-3">
							{/* bottom */}
							<div className="flex-1 w-full overflow-hidden flex items-center justify-center">
								<Bar options={barOptions} data={barData} />
							</div>
						</div>
					</div>
				</div>
			</>
		)
	}

	return (
		<div className="AdminDashboard bg-[#F7F9FF] flex items-stretch h-screen max-h-screen overflow-hidden">
			{/* Sidebar */}
			<Components.Sidebar page={"dashboard"} />

			{/* Right */}
			<div className="flex-1 flex flex-col items-stretch overflow-hidden">
				{/* Navbar */}
				<Components.AdminNavbar page={"Dashboard"} />
				{/* Page */}
				<div className="p-4 flex-1 flex flex-col h-full overflow-auto">
					{/* banner */}
					<div className="relative flex bg-white py-3 px-8 items-center rounded-md shadow">
						{/* text */}
						<div className="flex flex-col items-start">
							<Components.SubHeading className="!text-2xl">
								Welcome Back{" "}
								<span className="text-[#F38315]">{name}!</span>
							</Components.SubHeading>
							<Components.Paragraph className="!font-[Grandstander]">
								Have a nice day!
							</Components.Paragraph>
						</div>

						{/* chaacters svg */}
						<svg
							className="ml-auto mr-16"
							width="111"
							height="115"
							viewBox="0 0 141 145"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M117.02 9.14294C116.062 8.18406 114.216 4.55113 115.985 2.84045C117.754 1.12977 119.33 2.68288 119.451 3.51571C119.573 4.34854 119.249 11.3668 117.02 9.14294Z"
								fill="#263238"
							/>
							<path
								d="M116.615 139.825L112.595 139.861L111.501 130.569L115.517 130.533L116.615 139.825Z"
								fill="#FF8B7B"
							/>
							<path
								d="M112.591 139.398L116.975 139.357C117.056 139.358 117.135 139.385 117.199 139.433C117.264 139.482 117.312 139.55 117.336 139.627L118.398 143.188C118.426 143.271 118.434 143.359 118.421 143.446C118.408 143.532 118.374 143.615 118.322 143.685C118.27 143.756 118.202 143.813 118.124 143.852C118.046 143.891 117.959 143.91 117.871 143.908C116.291 143.908 113.995 143.823 112.019 143.841C109.696 143.841 108.661 144.003 105.933 144.03C104.285 144.03 103.682 142.382 104.379 142.229C107.472 141.513 109.07 141.419 111.659 139.722C111.931 139.525 112.255 139.412 112.591 139.398Z"
								fill="#263238"
							/>
							<path
								opacity="0.2"
								d="M111.501 130.574L112.068 135.364L116.084 135.328L115.521 130.538L111.501 130.574Z"
								fill="black"
							/>
							<path
								d="M110.93 140.113C111.363 140.106 111.795 140.053 112.217 139.956C112.237 139.953 112.255 139.943 112.269 139.928C112.283 139.914 112.292 139.895 112.294 139.875C112.295 139.855 112.291 139.836 112.282 139.819C112.272 139.802 112.257 139.788 112.24 139.78C112.051 139.686 110.362 138.88 109.899 139.163C109.856 139.191 109.821 139.229 109.797 139.274C109.773 139.319 109.762 139.369 109.764 139.42C109.763 139.507 109.781 139.592 109.819 139.67C109.856 139.748 109.911 139.817 109.98 139.87C110.261 140.053 110.595 140.138 110.93 140.113ZM111.893 139.825C111.024 139.978 110.362 139.947 110.092 139.731C110.045 139.694 110.008 139.647 109.984 139.593C109.96 139.538 109.949 139.479 109.953 139.42C109.95 139.402 109.953 139.383 109.961 139.366C109.969 139.349 109.982 139.335 109.998 139.325C110.25 139.172 111.204 139.533 111.893 139.825Z"
								fill="#407BFF"
							/>
							<path
								d="M112.199 139.983C112.22 139.981 112.241 139.973 112.257 139.96C112.271 139.95 112.281 139.936 112.287 139.92C112.293 139.904 112.293 139.887 112.289 139.87C112.289 139.798 111.974 138.069 111.02 138.177C110.767 138.204 110.695 138.335 110.682 138.434C110.614 138.884 111.645 139.758 112.158 139.974L112.199 139.983ZM111.101 138.362C111.677 138.362 111.965 139.303 112.064 139.713C111.533 139.415 110.83 138.731 110.871 138.461C110.871 138.461 110.871 138.385 111.042 138.367L111.101 138.362Z"
								fill="#407BFF"
							/>
							<path
								d="M113.775 29.4325L113.36 29.8827L112.973 30.2653C112.717 30.5174 112.451 30.756 112.186 30.9901C111.657 31.4643 111.117 31.9145 110.565 32.3407C109.45 33.2264 108.277 34.0355 107.053 34.7626C106.437 35.1273 105.802 35.4739 105.158 35.8025C104.514 36.1312 103.835 36.4148 103.15 36.7029C101.747 37.2627 100.285 37.6629 98.7927 37.8959L98.4596 37.9454C98.2431 37.9733 98.025 37.9868 97.8068 37.9859C97.3055 37.9812 96.8094 37.8835 96.3437 37.6978C95.8819 37.5124 95.459 37.2421 95.0967 36.901C94.8082 36.6258 94.5569 36.3141 94.3494 35.9736C94.062 35.4796 93.8453 34.9477 93.7057 34.3935C93.5965 33.9642 93.5168 33.5281 93.4671 33.088C93.3851 32.3271 93.3626 31.561 93.3996 30.7966C93.4311 30.0673 93.4896 29.365 93.5706 28.6762C93.7417 27.2942 93.9848 25.9751 94.2819 24.6246C94.579 23.2741 94.9167 22.0271 95.3533 20.7216L98.311 21.3068C98.203 23.8368 98.0814 26.4298 98.1624 28.8788C98.1772 30.016 98.2978 31.1493 98.5226 32.2641C98.567 32.4701 98.6287 32.6719 98.7072 32.8674C98.7702 33.0204 98.8467 33.115 98.8422 33.0745C98.8161 33.0059 98.7745 32.9443 98.7207 32.8944C98.5982 32.7759 98.4547 32.6812 98.2975 32.6153C98.1357 32.5472 97.9639 32.5062 97.7888 32.4937C97.7078 32.4937 97.6717 32.4937 97.6222 32.4937H97.6718L97.7663 32.4667C98.8327 32.1928 99.87 31.8159 100.864 31.3413C101.903 30.8396 102.909 30.2712 103.875 29.6396C104.852 28.9913 105.815 28.2891 106.743 27.5463C107.193 27.1771 107.666 26.79 108.093 26.3983L108.751 25.8041L109.066 25.5115L109.34 25.2504L113.775 29.4325Z"
								fill="#FF8B7B"
							/>
							<path
								d="M116.156 27.8433C116.003 23.5982 112.519 22.1216 108.152 25.0162C106.227 26.2368 104.374 27.567 102.601 29.0003L105.424 38.0669C105.424 38.0669 110.826 36.3517 113.95 32.9844C116.053 30.6975 116.21 29.2884 116.156 27.8433Z"
								fill="#263238"
							/>
							<path
								opacity="0.2"
								d="M110.839 29.653C110.839 29.653 108.233 33.3805 107.31 37.3421C108.592 36.7956 109.826 36.1452 111.002 35.3973L110.839 29.653Z"
								fill="black"
							/>
							<path
								d="M98.1625 22.6528L99.6751 19.2359L95.3939 17.9844C95.3939 17.9844 94.6601 19.6186 95.0788 22.4232L98.1625 22.6528Z"
								fill="#FF8B7B"
							/>
							<path
								d="M100.13 15.2293L96.4067 15.675L95.3938 17.9844L99.675 19.2359L100.13 15.2293Z"
								fill="#FF8B7B"
							/>
							<path
								d="M110.866 58.6175C110.866 58.6175 108.102 81.7837 107.796 94.1816C107.481 107.061 110.007 133.041 110.007 133.041L117.259 132.888C117.259 132.888 118.132 105.076 119.186 92.3314C120.329 78.4389 123.21 58.3654 123.21 58.3654L110.866 58.6175Z"
								fill="#407BFF"
							/>
							<path
								opacity="0.6"
								d="M110.866 58.6175C110.866 58.6175 108.102 81.7837 107.796 94.1816C107.481 107.061 110.007 133.041 110.007 133.041L117.259 132.888C117.259 132.888 118.132 105.076 119.186 92.3314C120.329 78.4389 123.21 58.3654 123.21 58.3654L110.866 58.6175Z"
								fill="white"
							/>
							<path
								opacity="0.2"
								d="M119.505 65.1766C116.264 72.3209 117.133 88.2798 118.974 95.1225C119.042 94.1276 119.114 93.1867 119.186 92.3179C119.937 83.1612 121.437 71.326 122.386 64.3168C121.504 63.0383 120.518 62.9392 119.505 65.1766Z"
								fill="black"
							/>
							<path
								d="M118.15 133.199L109.624 133.37L108.994 130.538L118.047 130.515L118.15 133.199Z"
								fill="#407BFF"
							/>
							<path
								d="M134.528 139.825L130.512 139.861L129.418 130.569L133.434 130.533L134.528 139.825Z"
								fill="#FF8B7B"
							/>
							<path
								d="M130.503 139.398L134.893 139.357C134.973 139.359 135.051 139.386 135.116 139.434C135.181 139.483 135.228 139.55 135.253 139.627L136.315 143.188C136.342 143.271 136.349 143.359 136.336 143.445C136.322 143.531 136.288 143.613 136.237 143.683C136.185 143.754 136.118 143.811 136.04 143.85C135.962 143.889 135.876 143.909 135.788 143.908C134.204 143.908 131.912 143.823 129.936 143.841C127.613 143.841 126.573 144.003 123.85 144.03C122.202 144.03 121.599 142.382 122.297 142.229C125.385 141.513 126.983 141.419 129.576 139.722C129.847 139.525 130.169 139.413 130.503 139.398Z"
								fill="#263238"
							/>
							<path
								opacity="0.2"
								d="M129.418 130.574L129.981 135.364L134.001 135.328L133.438 130.538L129.418 130.574Z"
								fill="black"
							/>
							<path
								d="M128.847 140.113C129.28 140.105 129.712 140.052 130.134 139.956C130.154 139.953 130.172 139.943 130.185 139.928C130.198 139.913 130.205 139.894 130.206 139.875C130.209 139.856 130.206 139.836 130.197 139.819C130.188 139.802 130.174 139.789 130.157 139.78C129.963 139.686 128.275 138.88 127.816 139.163C127.772 139.19 127.737 139.228 127.713 139.273C127.689 139.318 127.678 139.369 127.681 139.42C127.68 139.506 127.698 139.591 127.735 139.669C127.772 139.747 127.825 139.816 127.892 139.87C128.176 140.052 128.511 140.138 128.847 140.113ZM129.81 139.825C128.941 139.978 128.279 139.947 128.009 139.731C127.963 139.694 127.926 139.646 127.901 139.592C127.876 139.538 127.863 139.479 127.865 139.42C127.863 139.402 127.865 139.383 127.873 139.366C127.881 139.349 127.894 139.335 127.91 139.325C128.162 139.172 129.108 139.533 129.81 139.825Z"
								fill="#407BFF"
							/>
							<path
								d="M130.112 139.983C130.126 139.982 130.139 139.979 130.152 139.973C130.164 139.967 130.175 139.958 130.184 139.947C130.193 139.937 130.199 139.924 130.203 139.911C130.207 139.898 130.208 139.884 130.206 139.87C130.206 139.798 129.891 138.069 128.937 138.177C128.685 138.204 128.613 138.335 128.595 138.434C128.532 138.884 129.562 139.758 130.076 139.974L130.112 139.983ZM129.018 138.362C129.589 138.362 129.882 139.303 129.981 139.713C129.45 139.415 128.743 138.731 128.784 138.461C128.784 138.461 128.784 138.385 128.955 138.367L129.018 138.362Z"
								fill="#407BFF"
							/>
							<path
								d="M117.943 58.4645C117.943 58.4645 119.947 83.3908 121.41 95.6897C122.927 108.484 127.924 133.028 127.924 133.028L135.176 132.874C135.176 132.874 133.186 105.008 132.416 92.2414C131.575 78.3083 131.359 58.1584 131.359 58.1584L117.943 58.4645Z"
								fill="#407BFF"
							/>
							<path
								opacity="0.6"
								d="M117.943 58.4645C117.943 58.4645 119.947 83.3908 121.41 95.6897C122.927 108.484 127.924 133.028 127.924 133.028L135.176 132.874C135.176 132.874 133.186 105.008 132.416 92.2414C131.575 78.3083 131.359 58.1584 131.359 58.1584L117.943 58.4645Z"
								fill="white"
							/>
							<path
								d="M136.067 133.199L127.537 133.37L126.911 130.538L135.964 130.515L136.067 133.199Z"
								fill="#407BFF"
							/>
							<path
								d="M110.367 23.9043C110.367 23.9043 107.4 34.9156 110.866 58.6175C117.34 58.478 128.212 58.2259 131.359 58.1674C131.44 54.8675 129.004 38.6881 131.854 23.0894C129.804 22.7355 127.73 22.5338 125.65 22.4862C122.606 22.375 119.557 22.4412 116.521 22.6843C114.441 22.9304 112.383 23.3383 110.367 23.9043Z"
								fill="#263238"
							/>
							<path
								opacity="0.2"
								d="M130.611 34.1908L127.257 31.4132C127.478 33.5831 129.441 38.8997 130.476 41.5917C130.458 39.2328 130.481 36.7433 130.611 34.1908Z"
								fill="black"
							/>
							<path
								d="M118.614 30.2878L114.954 37.5312C114.877 37.6833 114.85 37.856 114.877 38.0244C114.904 38.1929 114.984 38.3484 115.105 38.4685C115.226 38.5886 115.382 38.6672 115.551 38.6929C115.72 38.7187 115.892 38.6902 116.043 38.6116L118.434 37.2971C118.564 37.2272 118.711 37.1952 118.858 37.2048C119.005 37.2143 119.147 37.265 119.267 37.3511L121.621 39.0483C121.756 39.1467 121.92 39.1989 122.087 39.1973C122.254 39.1957 122.416 39.1403 122.55 39.0393C122.683 38.9383 122.78 38.7971 122.827 38.6366C122.874 38.4761 122.868 38.3047 122.81 38.1479L120.059 30.4139C120.011 30.2668 119.921 30.137 119.8 30.0407C119.679 29.9444 119.532 29.8859 119.378 29.8725C119.224 29.859 119.07 29.8912 118.934 29.9651C118.798 30.039 118.687 30.1512 118.614 30.2878Z"
								fill="white"
							/>
							<path
								d="M124.525 12.2042C124.012 15.1573 123.553 20.5505 125.65 22.4637C125.65 22.4637 125.038 25.1378 119.451 26.0652C115.697 24.8587 116.521 22.6798 116.521 22.6798C119.78 21.8245 119.64 19.398 119.024 17.1291L124.525 12.2042Z"
								fill="#FF8B7B"
							/>
							<path
								opacity="0.2"
								d="M122.283 14.2074L119.024 17.1065C119.175 17.6351 119.281 18.1759 119.339 18.7227C120.59 18.5156 122.278 17.102 122.382 15.792C122.446 15.2622 122.412 14.7252 122.283 14.2074Z"
								fill="black"
							/>
							<path
								d="M126.312 8.57115C125.227 12.4067 124.79 14.7071 122.396 16.2782C118.794 18.6371 114.378 15.828 114.292 11.7359C114.211 8.06245 115.994 2.40371 120.145 1.68343C121.056 1.52169 121.994 1.59542 122.869 1.89762C123.745 2.19983 124.528 2.7205 125.146 3.4103C125.764 4.1001 126.195 4.93618 126.399 5.83934C126.603 6.74249 126.573 7.68279 126.312 8.57115Z"
								fill="#FF8B7B"
							/>
							<path
								d="M124.003 10.9212C123.498 9.69667 123.134 5.66307 125.236 4.67268C127.338 3.68229 129.522 6.09975 128.968 7.2432C128.117 9.0169 125.173 13.7573 124.003 10.9212Z"
								fill="#263238"
							/>
							<path
								d="M125.259 6.09525C124.741 4.74472 118.569 3.97942 117.705 2.52534C116.678 0.796658 120.887 0.589573 123.782 1.46742C126.326 2.24173 128.023 2.98903 127.726 4.87977C127.559 5.9512 125.259 6.09525 125.259 6.09525Z"
								fill="#263238"
							/>
							<path
								d="M126.6 4.70413C126.6 4.70413 127.951 5.07328 128.689 4.08289C128.455 5.06427 127.307 6.05467 126.6 4.70413Z"
								fill="#263238"
							/>
							<path
								d="M120.419 0.539994C118.565 -0.900577 116.039 0.792095 116.278 2.66934C116.516 4.54658 122.769 5.97365 122.769 5.97365C122.769 5.97365 122.882 2.45325 120.419 0.539994Z"
								fill="#263238"
							/>
							<path
								d="M116.282 2.67836C116.566 3.99288 117.525 5.02379 119.465 5.7891C118.342 4.95871 117.491 3.81327 117.02 2.49829L116.282 2.67836Z"
								fill="#263238"
							/>
							<path
								d="M120.176 8.37759C120.109 8.69721 119.888 8.9178 119.681 8.87278C119.474 8.82776 119.361 8.53065 119.429 8.21552C119.496 7.9004 119.722 7.67981 119.929 7.72483C120.136 7.76984 120.248 8.08047 120.176 8.37759Z"
								fill="#263238"
							/>
							<path
								d="M116.602 7.60328C116.53 7.9184 116.309 8.13899 116.102 8.09397C115.895 8.04895 115.782 7.75634 115.85 7.44121C115.917 7.12609 116.143 6.9055 116.35 6.94602C116.557 6.98654 116.669 7.28815 116.602 7.60328Z"
								fill="#263238"
							/>
							<path
								d="M117.705 8.00842C117.117 8.89399 116.409 9.69391 115.602 10.3854C116.052 11.0291 117.056 10.9976 117.056 10.9976L117.705 8.00842Z"
								fill="#FF5652"
							/>
							<path
								d="M117.786 12.0736C118.208 12.1786 118.65 12.1798 119.074 12.0771C119.497 11.9744 119.889 11.7709 120.217 11.4839C120.226 11.4751 120.233 11.4646 120.238 11.453C120.242 11.4414 120.245 11.4289 120.245 11.4164C120.245 11.4038 120.242 11.3913 120.238 11.3797C120.233 11.3681 120.226 11.3576 120.217 11.3488C120.198 11.3317 120.174 11.3222 120.149 11.3222C120.124 11.3222 120.1 11.3317 120.082 11.3488C119.774 11.6075 119.411 11.7907 119.02 11.8837C118.629 11.9768 118.222 11.977 117.831 11.8845C117.806 11.8792 117.779 11.884 117.758 11.8979C117.736 11.9118 117.721 11.9337 117.716 11.9588C117.711 11.9839 117.715 12.0101 117.729 12.0316C117.743 12.0531 117.765 12.0682 117.79 12.0736H117.786Z"
								fill="#263238"
							/>
							<path
								d="M121.504 7.45927C121.539 7.46618 121.575 7.46353 121.608 7.45161C121.641 7.43969 121.67 7.41894 121.692 7.39162C121.715 7.36429 121.729 7.33141 121.734 7.29653C121.739 7.26165 121.734 7.22608 121.72 7.19366C121.599 6.9164 121.413 6.67212 121.178 6.48109C120.943 6.29006 120.666 6.15778 120.37 6.09523C120.32 6.08876 120.269 6.10207 120.229 6.13235C120.188 6.16262 120.161 6.20745 120.154 6.25729C120.15 6.28183 120.151 6.30688 120.157 6.33102C120.163 6.35516 120.173 6.37791 120.188 6.39798C120.202 6.41804 120.221 6.43503 120.242 6.44797C120.263 6.46091 120.287 6.46954 120.311 6.47338C120.545 6.52471 120.763 6.63118 120.947 6.78389C121.131 6.9366 121.276 7.13113 121.369 7.35123C121.382 7.37847 121.4 7.40242 121.424 7.42117C121.447 7.43992 121.475 7.45297 121.504 7.45927Z"
								fill="#263238"
							/>
							<path
								d="M115.296 6.03216C115.332 6.04193 115.369 6.0407 115.404 6.02864C115.438 6.01657 115.468 5.99425 115.49 5.96464C115.632 5.77341 115.818 5.61836 116.031 5.51201C116.245 5.40566 116.48 5.35099 116.719 5.3524C116.769 5.35717 116.819 5.34183 116.858 5.30975C116.897 5.27767 116.921 5.23147 116.926 5.18133C116.931 5.13118 116.915 5.08119 116.883 5.04236C116.851 5.00352 116.805 4.97902 116.755 4.97425C116.453 4.96528 116.153 5.02936 115.881 5.16103C115.609 5.2927 115.373 5.48807 115.193 5.73054C115.177 5.7498 115.165 5.7721 115.158 5.79609C115.151 5.82009 115.149 5.84527 115.152 5.87011C115.155 5.89495 115.162 5.91893 115.175 5.9406C115.187 5.96226 115.204 5.98117 115.224 5.99615C115.245 6.01419 115.27 6.0266 115.296 6.03216Z"
								fill="#263238"
							/>
							<path
								d="M132.835 26.1597C133.654 27.5912 134.339 28.9778 135.05 30.4048C135.761 31.8319 136.401 33.268 137.008 34.7356C137.616 36.2031 138.206 37.6932 138.719 39.2374C139.253 40.7773 139.703 42.3446 140.07 43.9327L140.344 45.1617C140.464 45.7388 140.516 46.3282 140.497 46.9174C140.459 48.0122 140.216 49.0902 139.781 50.0957C139.017 51.7899 137.93 53.319 136.581 54.5974C135.377 55.7594 134.066 56.804 132.664 57.7172C131.984 58.1674 131.282 58.5815 130.575 58.9777C129.868 59.3738 129.166 59.7385 128.378 60.0851L126.884 57.4696C127.429 57.0194 128.027 56.5692 128.585 56.083C129.144 55.5968 129.688 55.1016 130.229 54.6064C131.272 53.6387 132.239 52.5928 133.123 51.4777C133.909 50.5214 134.519 49.4331 134.924 48.2634C135.063 47.8276 135.118 47.3693 135.086 46.9129C135.073 46.7294 135.038 46.5481 134.982 46.3727L134.676 45.3643C133.767 42.5672 132.684 39.8294 131.435 37.1665C130.818 35.816 130.161 34.4655 129.504 33.1149C128.847 31.7644 128.153 30.4138 127.483 29.1308L132.835 26.1597Z"
								fill="#FF8B7B"
							/>
							<path
								d="M132.007 23.112C135.761 23.9223 138.372 33.7182 138.372 33.7182L131.66 39.8091C129.526 37.4349 127.848 34.688 126.708 31.7059C124.93 26.8035 127.991 22.2386 132.007 23.112Z"
								fill="#263238"
							/>
							<path
								d="M132.007 23.112C135.761 23.9223 138.372 33.7182 138.372 33.7182L131.66 39.8091C129.526 37.4349 127.848 34.688 126.708 31.7059C124.93 26.8035 127.991 22.2386 132.007 23.112Z"
								fill="black"
								fill-opacity="0.2"
							/>
							<path
								d="M127.699 57.0059L123.382 57.0509L126.083 61.4041C126.083 61.4041 129.158 60.6433 129.432 59.0992L127.699 57.0059Z"
								fill="#FF8B7B"
							/>
							<path
								d="M120.694 59.6214L123.075 63.1148L126.06 61.4041L123.381 57.0509L120.694 59.6214Z"
								fill="#FF8B7B"
							/>
							<path
								d="M127.492 12.0826C127.012 12.9651 126.203 13.6221 125.241 13.9103C123.962 14.284 123.309 13.145 123.652 11.934C123.962 10.8446 125.002 9.33651 126.281 9.49408C127.559 9.65164 128.063 10.9977 127.492 12.0826Z"
								fill="#FF8B7B"
							/>
							<path
								d="M89.228 86.5676L84.4282 86.9158L84.4608 87.3648L89.2606 87.0166L89.228 86.5676Z"
								fill="#C33B4C"
							/>
							<path
								d="M93.541 86.2565L91.1837 86.4276L91.2163 86.8766L93.5735 86.7055L93.541 86.2565Z"
								fill="#C33B4C"
							/>
							<path
								d="M114.252 33.4122L34.7682 39.1429C33.114 39.272 31.5773 40.0482 30.4918 41.3032C29.4063 42.5581 28.8594 44.1905 28.9699 45.8461L31.671 83.3099C31.7989 84.9667 32.5759 86.5059 33.833 87.5926C35.09 88.6793 36.7253 89.2257 38.3832 89.1127L42.885 88.7886C43.212 88.7651 43.5351 88.8722 43.7832 89.0866C44.0313 89.301 44.1843 89.6051 44.2085 89.9321L44.7127 96.8738C44.7209 97.0082 44.7691 97.1372 44.8512 97.244C44.9332 97.3508 45.0454 97.4306 45.1731 97.4732C45.3009 97.5158 45.4385 97.5192 45.5682 97.483C45.698 97.4468 45.8139 97.3726 45.9011 97.27L53.4371 88.559C53.754 88.1941 54.2022 87.9692 54.6841 87.9333L117.853 83.382C119.508 83.254 121.046 82.4783 122.132 81.2232C123.219 79.9682 123.766 78.3351 123.656 76.6788L120.955 39.215C120.827 37.5599 120.051 36.0221 118.796 34.9356C117.541 33.8492 115.908 33.3017 114.252 33.4122Z"
								fill="#C33B4C"
							/>
							<path
								d="M46.3784 56.3396L50.6731 56.029L51.0243 60.8909L55.7151 60.5533L55.364 55.6914L59.6767 55.3763L60.6806 69.2688L56.3679 69.5794L55.9627 63.9612L51.2719 64.3033L51.677 69.9215L47.3868 70.2321L46.3784 56.3396Z"
								fill="white"
							/>
							<path
								opacity="0.2"
								d="M34.7684 39.1428C33.1141 39.2719 31.5775 40.0481 30.4919 41.3031C29.4064 42.558 28.8595 44.1904 28.9701 45.846L31.6711 83.3098C31.799 84.9666 32.576 86.5058 33.8331 87.5925C35.0901 88.6792 36.7255 89.2256 38.3833 89.1126L39.0451 89.0631C40.1446 88.9837 41.1871 88.5435 42.0109 87.8109C42.8347 87.0783 43.3936 86.0943 43.6009 85.0115L52.6539 37.8508L34.7684 39.1428Z"
								fill="black"
							/>
							<path
								d="M74.1544 64.1998L66.4203 64.758C66.4796 65.259 66.69 65.73 67.0235 66.1085C67.2148 66.3098 67.4501 66.4641 67.711 66.5594C67.9718 66.6547 68.2511 66.6883 68.5271 66.6577C68.9063 66.6307 69.2721 66.5067 69.5895 66.2976C69.838 66.1095 70.0501 65.8776 70.2153 65.6133L74.0418 65.6899C73.6255 66.6333 72.9494 67.439 72.0925 68.0128C71.3062 68.511 70.1448 68.8111 68.6082 68.9131C67.5338 69.0382 66.4452 68.9229 65.4209 68.5755C64.5998 68.2308 63.895 67.6573 63.3906 66.9234C62.8123 66.0878 62.48 65.1067 62.4317 64.0917C62.3514 63.3868 62.4196 62.6729 62.6321 61.996C62.8445 61.3191 63.1965 60.6942 63.6652 60.1617C64.6016 59.1173 65.9521 58.5305 67.7168 58.4015C68.8851 58.2627 70.0696 58.4015 71.1742 58.8066C72.0199 59.1679 72.7325 59.783 73.2135 60.5668C73.7642 61.5403 74.073 62.6319 74.1138 63.7496L74.1544 64.1998ZM70.1028 62.6332C70.048 62.0477 69.7955 61.4984 69.387 61.0755C69.1812 60.9172 68.945 60.8027 68.6932 60.7394C68.4414 60.6761 68.1792 60.6652 67.9229 60.7074C67.6667 60.7496 67.4219 60.8441 67.2037 60.9848C66.9855 61.1256 66.7985 61.3097 66.6544 61.5257C66.4141 61.9493 66.2928 62.4299 66.3033 62.9168L70.1028 62.6332Z"
								fill="white"
							/>
							<path
								d="M75.3473 54.2463L79.2143 53.9672L80.2182 67.8552L76.3512 68.1343L75.3473 54.2463Z"
								fill="white"
							/>
							<path
								d="M81.8074 53.7781L85.6744 53.499L86.6783 67.387L82.8158 67.6661L81.8074 53.7781Z"
								fill="white"
							/>
							<path
								d="M88.3081 62.2415C88.235 61.5369 88.3111 60.8248 88.5313 60.1516C88.7516 59.4784 89.1111 58.8591 89.5866 58.3339C90.5499 57.2625 91.914 56.6623 93.6787 56.5332C95.6895 56.3892 97.2531 56.8634 98.3695 57.9558C99.2969 58.9337 99.8326 60.2183 99.8749 61.5653C99.9172 62.9123 99.4632 64.228 98.5991 65.2622C97.6448 66.3246 96.2612 66.9249 94.4485 67.0629C93.0403 67.2318 91.6178 66.8969 90.4329 66.1175C89.8027 65.6802 89.2827 65.1024 88.914 64.4297C88.5453 63.7571 88.3378 63.008 88.3081 62.2415ZM92.1751 61.9534C92.1679 62.664 92.4118 63.3543 92.8639 63.9027C93.0462 64.0893 93.2669 64.2341 93.5108 64.3271C93.7546 64.42 94.0158 64.4588 94.2761 64.4408C94.5364 64.4228 94.7898 64.3485 95.0185 64.2229C95.2473 64.0973 95.446 63.9236 95.6009 63.7136C95.9648 63.0869 96.1015 62.354 95.9881 61.6383C95.9925 60.9419 95.7519 60.2663 95.3083 59.7295C95.135 59.5393 94.9201 59.3916 94.6804 59.298C94.4407 59.2043 94.1827 59.1671 93.9263 59.1893C93.6589 59.2017 93.398 59.2756 93.1637 59.4052C92.9295 59.5348 92.7283 59.7166 92.5757 59.9366C92.213 60.5422 92.0774 61.257 92.1931 61.9534H92.1751Z"
								fill="white"
							/>
							<path
								d="M101.093 52.3826L105.212 52.0855L105.442 55.2367L105.104 61.6518L102.556 61.8363L101.318 55.5338L101.093 52.3826ZM101.993 62.8628L105.838 62.5836L106.085 65.987L102.236 66.2616L101.993 62.8628Z"
								fill="white"
							/>
							<path
								d="M33.6697 26.8079C33.6496 27.4669 33.6842 28.1264 33.7733 28.7797C29.694 30.1419 25.3436 30.4866 21.1008 29.7836C21.3044 29.0136 21.4281 28.2246 21.4699 27.4291C21.328 28.2301 21.0493 29.0006 20.6461 29.7071C19.8448 29.554 19.3946 29.4234 19.3946 29.4234C19.3946 29.4234 20.2139 24.9937 18.7373 21.7704C17.2607 18.5471 17.999 16.7464 19.1155 16.2377C21.1863 9.87219 28.9699 10.8761 31.6034 13.4601C34.9437 16.7374 34.9618 25.9706 35.556 28.0819C35.0653 28.2935 34.5836 28.4871 34.1019 28.6581C33.8607 28.0682 33.7148 27.4437 33.6697 26.8079Z"
								fill="#263238"
							/>
							<path
								d="M36.8885 36.7163L37.2937 37.9994C37.4423 38.4495 37.5908 38.8997 37.7439 39.3274C38.0455 40.2277 38.3606 41.1281 38.6982 41.9924C39.0359 42.8568 39.36 43.7661 39.7111 44.6485L40.2334 45.999L40.3639 46.3321L40.3954 46.4087C40.3398 46.36 40.2757 46.3218 40.2063 46.2961C40.1073 46.2601 40.0668 46.2961 40.1298 46.2961C40.2382 46.2957 40.346 46.279 40.4494 46.2466C40.8015 46.135 41.1398 45.984 41.4578 45.7964C42.2256 45.3491 42.9598 44.8466 43.6547 44.2928C44.384 43.7256 45.0998 43.1179 45.8021 42.4921C46.5043 41.8664 47.2111 41.2136 47.8909 40.5744L49.2729 41.7448C48.6967 42.5732 48.089 43.3295 47.4722 44.0993C46.8555 44.8691 46.1622 45.5894 45.4509 46.3051C44.7188 47.0524 43.9218 47.7333 43.0695 48.3399C42.5818 48.6816 42.0579 48.9684 41.5074 49.1953C41.1579 49.3354 40.7917 49.4293 40.4179 49.4744C39.9106 49.5376 39.3955 49.4678 38.9233 49.2718C38.4086 49.0525 37.9701 48.686 37.6628 48.2184C37.5953 48.1149 37.5323 48.0113 37.4828 47.9168L37.3612 47.6737L37.1992 47.3451C36.9876 46.8949 36.749 46.4447 36.5644 46.0215C36.1547 45.1212 35.7451 44.2208 35.3714 43.3205C34.9978 42.4201 34.6331 41.4927 34.2865 40.5654C34.1244 40.1152 33.9624 39.6245 33.8093 39.1518C33.6562 38.6791 33.5077 38.2154 33.3591 37.6617L36.8885 36.7163Z"
								fill="#FFC3BD"
							/>
							<path
								d="M35.8216 32.7188C37.3747 33.115 38.4597 39.4985 38.4597 39.4985L34.183 42.4066C34.183 42.4066 30.0864 35.9646 31.2793 34.2584C32.5218 32.4847 33.5572 32.1426 35.8216 32.7188Z"
								fill="#407BFF"
							/>
							<path
								d="M35.8216 32.7188C37.3747 33.115 38.4597 39.4985 38.4597 39.4985L34.183 42.4066C34.183 42.4066 30.0864 35.9646 31.2793 34.2584C32.5218 32.4847 33.5572 32.1426 35.8216 32.7188Z"
								fill="#C33B4C"
							/>
							<path
								opacity="0.3"
								d="M35.6821 34.1458L36.875 40.5789L34.4711 42.2085L35.6821 34.1458Z"
								fill="black"
							/>
							<path
								d="M47.8188 40.7274L49.2459 37.2881L51.0061 40.7274C51.0061 40.7274 49.8627 42.4381 48.3546 42.0195L47.8188 40.7274Z"
								fill="#FFC3BD"
							/>
							<path
								d="M50.8171 36.9325L53.077 37.8418L51.0062 40.7275L49.2415 37.2881L50.8171 36.9325Z"
								fill="#FFC3BD"
							/>
							<path
								d="M27.4258 140.185H31.1938L31.4459 131.465H27.6779L27.4258 140.185Z"
								fill="#FFC3BD"
							/>
							<path
								d="M2.16174 128.953L5.62361 130.43L10.1569 122.885L6.69054 121.408L2.16174 128.953Z"
								fill="#FFC3BD"
							/>
							<path
								d="M6.28988 129.917L2.68845 127.702C2.62687 127.662 2.55284 127.647 2.48056 127.658C2.40829 127.67 2.34284 127.708 2.29679 127.765L0.131437 130.362C0.0775635 130.43 0.0388656 130.509 0.017944 130.593C-0.0029777 130.678 -0.00563814 130.765 0.0101406 130.851C0.0259193 130.936 0.0597726 131.017 0.109424 131.088C0.159076 131.159 0.223377 131.219 0.298004 131.263C1.56751 132.015 2.21576 132.312 3.80039 133.284C4.77728 133.887 6.13682 134.86 7.48285 135.688C8.82888 136.516 9.73374 135.238 9.23404 134.765C7.05068 132.681 7.1137 131.691 6.70404 130.457C6.63595 130.233 6.48879 130.041 6.28988 129.917Z"
								fill="#263238"
							/>
							<path
								d="M31.3197 139.749H27.0926C27.0198 139.748 26.9492 139.773 26.8937 139.82C26.8383 139.868 26.8018 139.933 26.7909 140.005L26.3092 143.355C26.2975 143.44 26.3045 143.528 26.3299 143.611C26.3552 143.694 26.3983 143.77 26.4561 143.835C26.5139 143.899 26.585 143.951 26.6646 143.985C26.7442 144.02 26.8303 144.036 26.917 144.034C28.3936 144.012 29.1049 143.922 30.9686 143.922C32.112 143.922 34.48 144.043 36.0601 144.043C37.6402 144.043 37.7213 142.481 37.064 142.337C34.1153 141.702 32.9539 140.829 31.959 139.996C31.7828 139.839 31.5557 139.751 31.3197 139.749Z"
								fill="#263238"
							/>
							<path
								opacity="0.2"
								d="M31.4413 131.47L31.3152 135.963H27.5472L27.6778 131.47H31.4413Z"
								fill="black"
							/>
							<path
								opacity="0.2"
								d="M6.69055 121.413L10.1524 122.885L7.816 126.775L4.35413 125.298L6.69055 121.413Z"
								fill="black"
							/>
							<path
								d="M35.8215 32.7188C35.8215 32.7188 37.6222 33.349 34.0208 55.4393H18.7147C18.9713 49.2178 18.9803 45.3823 16.0137 32.6108C18.1539 32.1684 20.3235 31.8826 22.5052 31.7554C24.8177 31.5887 27.1391 31.5887 29.4515 31.7554C32.4407 32.0255 35.8215 32.7188 35.8215 32.7188Z"
								fill="#F38315"
							/>
							<path
								d="M22.5143 31.7509C24.8269 31.5886 27.148 31.5886 29.4606 31.7509C29.8342 31.7869 30.2169 31.8274 30.595 31.8725C30.7524 32.109 30.8533 32.3786 30.89 32.6604C30.9267 32.9422 30.8982 33.2286 30.8066 33.4976C30.3159 34.7086 28.5557 34.8481 27.2772 34.8481C22.5458 34.8481 21.7445 32.084 21.713 31.967L21.668 31.8004L22.5143 31.7509Z"
								fill="white"
							/>
							<path
								d="M23.2031 23.9358C23.6532 26.1867 24.0809 30.2653 22.5143 31.7554C22.5143 31.7554 23.1265 34.0063 27.2772 34.0063C31.842 34.0063 29.4605 31.7554 29.4605 31.7554C26.9665 31.1612 27.0341 29.3109 27.4662 27.5777L23.2031 23.9358Z"
								fill="#FFC3BD"
							/>
							<path
								d="M23.6578 22.3466C23.1221 24.1158 23.8649 28.3024 24.9678 29.9231C22.7935 28.6761 22.0597 24.8766 22.0597 24.8766L23.6578 22.3466Z"
								fill="#263238"
							/>
							<path
								opacity="0.2"
								d="M24.9408 25.4214L27.4663 27.5732C27.3555 27.9766 27.2832 28.3896 27.2503 28.8067C26.3004 28.6671 24.9994 27.6227 24.8913 26.6278C24.8354 26.226 24.8522 25.8173 24.9408 25.4214Z"
								fill="black"
							/>
							<path
								d="M21.1413 19.9472C22.0146 23.5801 22.3027 25.1378 24.4906 26.6999C27.7814 29.0453 32.0536 27.1816 32.2832 23.3596C32.4903 19.9202 31.0317 14.5586 27.1827 13.7302C26.3346 13.543 25.4528 13.5756 24.6208 13.8249C23.7889 14.0743 23.0345 14.5321 22.4293 15.1549C21.824 15.7778 21.388 16.545 21.1626 17.3837C20.9371 18.2224 20.9298 19.1049 21.1413 19.9472Z"
								fill="#FFC3BD"
							/>
							<path
								d="M34.0253 55.4392C34.0253 55.4392 36.992 84.4397 36.7264 95.9193C36.4698 107.858 32.0941 135.085 32.0941 135.085H27.0071C27.0071 135.085 27.8129 108.547 27.3627 96.8196C26.872 84.0346 22.8114 55.4302 22.8114 55.4302L34.0253 55.4392Z"
								fill="#407BFF"
							/>
							<path
								opacity="0.4"
								d="M34.0253 55.4392C34.0253 55.4392 36.992 84.4397 36.7264 95.9193C36.4698 107.858 32.0941 135.085 32.0941 135.085H27.0071C27.0071 135.085 27.8129 108.547 27.3627 96.8196C26.872 84.0346 22.8114 55.4302 22.8114 55.4302L34.0253 55.4392Z"
								fill="black"
							/>
							<path
								d="M26.5839 135.274H32.5533L32.9945 133.37L26.3048 133.135L26.5839 135.274Z"
								fill="#407BFF"
							/>
							<path
								opacity="0.2"
								d="M27.4303 62.6556C31.1848 70.2096 28.1821 83.9896 26.8541 89.1171C26.1743 81.4191 25.0263 72.0103 24.1305 65.0911C24.6977 61.2016 25.6971 59.1712 27.4303 62.6556Z"
								fill="black"
							/>
							<path
								d="M29.9873 55.4392C29.9873 55.4392 26.5209 85.6012 23.9054 95.2665C20.8036 106.76 8.99545 126.329 8.99545 126.329L4.27307 124.321C4.27307 124.321 11.5795 102.1 13.9564 96.0453C19.0209 83.1252 14.6857 63.8711 18.7328 55.4392H29.9873Z"
								fill="#407BFF"
							/>
							<path
								opacity="0.4"
								d="M29.9873 55.4392C29.9873 55.4392 26.5209 85.6012 23.9054 95.2665C20.8036 106.76 8.99545 126.329 8.99545 126.329L4.27307 124.321C4.27307 124.321 11.5795 102.1 13.9564 96.0453C19.0209 83.1252 14.6857 63.8711 18.7328 55.4392H29.9873Z"
								fill="black"
							/>
							<path
								d="M3.62024 124.335L9.48156 126.829L10.8906 125.253L4.12894 122.007L3.62024 124.335Z"
								fill="#407BFF"
							/>
							<path
								d="M26.917 19.9967C26.971 20.2938 27.1691 20.5099 27.3672 20.4739C27.5653 20.4379 27.6778 20.1678 27.6238 19.8707C27.5698 19.5736 27.3717 19.3575 27.1736 19.389C26.9755 19.4205 26.8405 19.6951 26.917 19.9967Z"
								fill="#263238"
							/>
							<path
								d="M30.2754 19.4025C30.3249 19.6996 30.5275 19.9157 30.7256 19.8797C30.9236 19.8437 31.0407 19.5736 30.9867 19.2765C30.9326 18.9793 30.7346 18.7633 30.5365 18.7948C30.3384 18.8263 30.2214 19.1009 30.2754 19.4025Z"
								fill="#263238"
							/>
							<path
								d="M30.4509 18.8307L31.1307 18.4931C31.1307 18.4931 30.8606 19.1188 30.4509 18.8307Z"
								fill="#263238"
							/>
							<path
								d="M29.4696 20.0733C29.8561 20.7086 30.3288 21.2874 30.8742 21.793C30.7405 21.9282 30.5792 22.0328 30.4012 22.0997C30.2232 22.1665 30.0329 22.194 29.8433 22.1801L29.4696 20.0733Z"
								fill="#ED847E"
							/>
							<path
								d="M28.4882 23.5892C28.6587 23.5889 28.8289 23.5738 28.9969 23.5442C29.0097 23.5436 29.0223 23.5404 29.0338 23.5346C29.0453 23.5288 29.0554 23.5206 29.0634 23.5106C29.0715 23.5005 29.0773 23.4889 29.0805 23.4764C29.0837 23.4639 29.0841 23.4509 29.0819 23.4383C29.0796 23.4256 29.0746 23.4136 29.0673 23.403C29.06 23.3924 29.0505 23.3835 29.0395 23.3769C29.0284 23.3703 29.0161 23.3662 29.0033 23.3647C28.9905 23.3633 28.9776 23.3646 28.9653 23.3686C28.5946 23.4425 28.2117 23.4275 27.8479 23.325C27.4841 23.2225 27.1496 23.0354 26.872 22.7788C26.8552 22.7623 26.8326 22.7531 26.809 22.7531C26.7854 22.7531 26.7628 22.7623 26.746 22.7788C26.7372 22.7869 26.7303 22.7966 26.7255 22.8074C26.7207 22.8183 26.7183 22.83 26.7183 22.8419C26.7183 22.8537 26.7207 22.8654 26.7255 22.8763C26.7303 22.8871 26.7372 22.8969 26.746 22.9049C27.2158 23.3505 27.8406 23.5959 28.4882 23.5892Z"
								fill="#263238"
							/>
							<path
								d="M22.4153 17.8179C22.5137 18.7752 22.664 19.7265 22.8654 20.6675C22.8654 20.6675 25.1163 17.8179 25.49 16.2918C25.4007 16.8926 25.2263 17.4777 24.9723 18.0295C24.9723 18.0295 28.002 17.3677 28.2991 15.3689C28.294 16.2637 28.1944 17.1555 28.002 18.0295C28.002 18.0295 30.8921 16.895 30.6265 14.9773C30.3609 13.0595 25.9221 12.3167 23.8738 12.965C21.8255 13.6132 19.8222 15.7155 20.4255 18.6057C21.0287 21.4958 22.1857 22.5808 22.1857 22.5808C22.1857 22.5808 21.3528 19.6681 22.4153 17.8179Z"
								fill="#263238"
							/>
							<path
								d="M20.9837 22.6842C21.2616 23.3511 21.7926 23.8805 22.4603 24.1563C23.3607 24.5165 23.8964 23.7467 23.7388 22.8553C23.5993 22.0495 22.9645 20.897 22.0326 20.915C21.8287 20.9241 21.6303 20.9837 21.4552 21.0887C21.2801 21.1936 21.134 21.3405 21.0299 21.5161C20.9258 21.6916 20.867 21.8904 20.859 22.0943C20.8509 22.2983 20.8938 22.501 20.9837 22.6842Z"
								fill="#FFC3BD"
							/>
							<path
								d="M22.96 16.4312C22.5098 18.232 23.4461 22.3736 24.6256 23.9357C22.3747 22.7968 21.4744 19.0333 21.4744 19.0333L22.96 16.4312Z"
								fill="#263238"
							/>
							<path
								d="M25.6836 18.9703C25.7067 18.9633 25.7282 18.9517 25.7468 18.9362C25.7653 18.9207 25.7806 18.9017 25.7916 18.8802C25.8865 18.6771 26.0282 18.4995 26.2051 18.3617C26.3819 18.224 26.5889 18.1302 26.809 18.0879C26.8556 18.0812 26.8978 18.0569 26.9271 18.0201C26.9564 17.9833 26.9705 17.9367 26.9666 17.8898C26.9644 17.8663 26.9574 17.8435 26.9462 17.8227C26.9349 17.8019 26.9196 17.7836 26.9011 17.7689C26.8826 17.7542 26.8613 17.7433 26.8386 17.7371C26.8158 17.7308 26.792 17.7291 26.7685 17.7323C26.4892 17.7807 26.2257 17.8956 26.0001 18.0671C25.7744 18.2387 25.5933 18.462 25.472 18.7182C25.4567 18.7495 25.4508 18.7845 25.4551 18.8191C25.4593 18.8537 25.4735 18.8863 25.4959 18.913C25.5183 18.9396 25.5479 18.9593 25.5812 18.9694C25.6146 18.9796 25.6501 18.9799 25.6836 18.9703Z"
								fill="#263238"
							/>
							<path
								d="M31.5043 17.5747C31.527 17.5757 31.5495 17.5718 31.5705 17.5632C31.5915 17.5547 31.6104 17.5417 31.6259 17.5252C31.6589 17.4916 31.6774 17.4463 31.6774 17.3992C31.6774 17.352 31.6589 17.3068 31.6259 17.2731C31.4339 17.0654 31.1957 16.9057 30.9306 16.8072C30.6655 16.7086 30.3808 16.6739 30.0998 16.7059C30.0764 16.7102 30.0541 16.7191 30.0341 16.7321C30.0142 16.7451 29.997 16.762 29.9836 16.7816C29.9702 16.8013 29.9609 16.8234 29.9561 16.8468C29.9513 16.8701 29.9512 16.8941 29.9557 16.9175C29.9655 16.963 29.9925 17.003 30.0312 17.029C30.0698 17.055 30.117 17.0651 30.1628 17.057C30.3844 17.0323 30.6088 17.0601 30.8176 17.1383C31.0265 17.2166 31.214 17.3429 31.3648 17.5072C31.3816 17.5282 31.4028 17.5451 31.4269 17.5568C31.4511 17.5684 31.4775 17.5746 31.5043 17.5747Z"
								fill="#263238"
							/>
							<path
								d="M17.882 37.9544C17.2562 39.9306 16.6575 42.006 16.1488 44.0498C15.6368 46.0674 15.2623 48.1174 15.0279 50.1857L14.9918 50.5638C14.9918 50.6854 14.9918 50.7124 14.9918 50.8205C14.9968 51.0328 15.0133 51.2447 15.0414 51.4552C15.0987 51.9483 15.1813 52.4382 15.289 52.9228C15.5005 53.9267 15.7391 54.9621 16.0453 55.9885C16.3514 57.0149 16.6125 58.0593 16.9186 59.0947L17.819 62.201L16.1488 62.8897C15.1224 60.927 14.231 58.9282 13.3982 56.8663C12.9975 55.8309 12.6059 54.7865 12.2818 53.6836C12.1197 53.1344 11.9666 52.5716 11.8316 51.9594C11.7675 51.6352 11.7224 51.3075 11.6965 50.978C11.6965 50.8114 11.6965 50.5638 11.6965 50.4153V49.9651C11.7347 48.818 11.8399 47.6741 12.0117 46.5393C12.1602 45.4138 12.3808 44.3154 12.6194 43.2214C13.0878 41.0305 13.6892 38.8702 14.4201 36.7524L17.882 37.9544Z"
								fill="#FFC3BD"
							/>
							<path
								d="M16.0227 32.6107C14.4921 33.0609 12.6509 38.3505 12.6509 38.3505L18.5932 42.6001C18.5932 42.6001 20.7631 38.1974 20.1193 36.2166C19.4486 34.1548 17.7739 32.0795 16.0227 32.6107Z"
								fill="#C33B4C"
							/>
							<path
								d="M7.81149 131.348C7.88469 131.323 7.95129 131.281 8.00655 131.226C8.0618 131.172 8.10434 131.106 8.13111 131.033C8.15713 130.986 8.17078 130.934 8.17078 130.88C8.17078 130.827 8.15713 130.774 8.13111 130.727C7.86101 130.331 6.49697 130.362 6.3304 130.367C6.31313 130.367 6.29632 130.372 6.28195 130.382C6.26758 130.392 6.25627 130.405 6.24937 130.421C6.2406 130.435 6.23596 130.451 6.23596 130.468C6.23596 130.485 6.2406 130.501 6.24937 130.515C6.60501 130.871 7.27127 131.452 7.73946 131.362L7.81149 131.348ZM6.54649 130.529C7.0912 130.529 7.82049 130.606 7.96455 130.817C7.97686 130.837 7.98337 130.861 7.98337 130.885C7.98337 130.908 7.97686 130.932 7.96455 130.952C7.94464 131.006 7.91162 131.055 7.86843 131.094C7.82523 131.132 7.7732 131.159 7.71695 131.173C7.46935 131.236 7.03718 130.979 6.54649 130.529Z"
								fill="#407BFF"
							/>
							<path
								d="M6.94716 130.434C7.36132 130.304 7.8025 130.074 7.89704 129.818C7.92052 129.751 7.92086 129.678 7.89799 129.611C7.87512 129.544 7.83039 129.487 7.77099 129.449C7.71855 129.405 7.65685 129.374 7.59056 129.357C7.52426 129.341 7.45511 129.34 7.38834 129.354C6.85262 129.449 6.27639 130.367 6.25388 130.407C6.24598 130.421 6.24182 130.437 6.24182 130.452C6.24182 130.468 6.24598 130.484 6.25388 130.498C6.26198 130.511 6.27319 130.522 6.28654 130.53C6.29988 130.537 6.31495 130.542 6.33041 130.543C6.54014 130.537 6.7479 130.5 6.94716 130.434ZM7.36132 129.534H7.41985C7.46217 129.525 7.50593 129.526 7.54796 129.536C7.58999 129.546 7.62926 129.566 7.66294 129.593C7.75298 129.665 7.74397 129.719 7.73047 129.759C7.64043 130.007 6.95616 130.304 6.50148 130.362C6.70834 130.016 7.0056 129.733 7.36132 129.543V129.534Z"
								fill="#407BFF"
							/>
							<path
								d="M32.7333 140.406C33.0507 140.432 33.3676 140.351 33.6337 140.176C33.6955 140.12 33.7427 140.05 33.7709 139.971C33.7992 139.893 33.8077 139.809 33.7957 139.726C33.7922 139.677 33.7763 139.63 33.7495 139.589C33.7228 139.548 33.686 139.515 33.6427 139.492C33.1925 139.24 31.6844 140.005 31.5133 140.091C31.4968 140.098 31.4827 140.109 31.4728 140.124C31.4628 140.139 31.4575 140.156 31.4575 140.174C31.4575 140.192 31.4628 140.209 31.4728 140.224C31.4827 140.239 31.4968 140.251 31.5133 140.257C31.9139 140.348 32.3227 140.398 32.7333 140.406ZM33.4041 139.627C33.4614 139.623 33.5187 139.634 33.5707 139.659C33.5884 139.668 33.6032 139.683 33.6135 139.7C33.6238 139.718 33.6292 139.737 33.6292 139.758C33.6376 139.809 33.6329 139.863 33.6156 139.912C33.5983 139.962 33.569 140.006 33.5301 140.041C33.3006 140.248 32.6793 140.284 31.8465 140.145C32.3326 139.885 32.8593 139.71 33.4041 139.627Z"
								fill="#407BFF"
							/>
							<path
								d="M31.5674 140.275H31.6034C32.0536 140.073 32.9539 139.262 32.8729 138.835C32.8729 138.731 32.7829 138.61 32.5353 138.583C32.4466 138.573 32.3569 138.581 32.2717 138.608C32.1865 138.634 32.1077 138.678 32.0401 138.736C31.5899 139.132 31.4819 140.145 31.4774 140.185C31.4768 140.201 31.4802 140.217 31.4873 140.231C31.4944 140.245 31.5049 140.257 31.5179 140.266C31.5326 140.276 31.5503 140.279 31.5674 140.275ZM32.4677 138.749H32.5218C32.6838 138.749 32.6973 138.835 32.6973 138.853C32.7424 139.109 32.1391 139.753 31.6799 140.028C31.7159 139.6 31.8843 139.194 32.1616 138.866C32.2442 138.791 32.3517 138.75 32.4632 138.749H32.4677Z"
								fill="#407BFF"
							/>
							<path
								d="M18.5033 54.5434L18.1162 55.8939C18.0621 55.9975 18.1882 56.1055 18.3638 56.1055H34.12C34.2596 56.1055 34.3721 56.038 34.3811 55.9525L34.5207 54.6019C34.5207 54.5074 34.4081 54.4264 34.2595 54.4264H18.7554C18.7069 54.4226 18.6582 54.4314 18.614 54.4519C18.5699 54.4724 18.5317 54.5039 18.5033 54.5434Z"
								fill="#263238"
							/>
							<path
								d="M20.583 56.2721H20.1643C20.0833 56.2721 20.0203 56.2316 20.0248 56.1775L20.2183 54.3768C20.2183 54.3273 20.2994 54.2823 20.3804 54.2823H20.7946C20.8801 54.2823 20.9386 54.3273 20.9341 54.3768L20.7405 56.1775C20.7405 56.2496 20.6685 56.2721 20.583 56.2721Z"
								fill="#407BFF"
							/>
							<path
								opacity="0.4"
								d="M20.583 56.2721H20.1643C20.0833 56.2721 20.0203 56.2316 20.0248 56.1775L20.2183 54.3768C20.2183 54.3273 20.2994 54.2823 20.3804 54.2823H20.7946C20.8801 54.2823 20.9386 54.3273 20.9341 54.3768L20.7405 56.1775C20.7405 56.2496 20.6685 56.2721 20.583 56.2721Z"
								fill="black"
							/>
							<path
								d="M32.9314 56.2721H32.5172C32.4362 56.2721 32.3732 56.2316 32.3777 56.1775L32.5757 54.3768C32.5757 54.3273 32.6523 54.2823 32.7333 54.2823H33.1475C33.233 54.2823 33.296 54.3273 33.287 54.3768L33.0935 56.1775C33.0889 56.2496 33.0169 56.2721 32.9314 56.2721Z"
								fill="#407BFF"
							/>
							<path
								opacity="0.4"
								d="M32.9314 56.2721H32.5172C32.4362 56.2721 32.3732 56.2316 32.3777 56.1775L32.5757 54.3768C32.5757 54.3273 32.6523 54.2823 32.7333 54.2823H33.1475C33.233 54.2823 33.296 54.3273 33.287 54.3768L33.0935 56.1775C33.0889 56.2496 33.0169 56.2721 32.9314 56.2721Z"
								fill="black"
							/>
							<path
								d="M26.7595 56.2721H26.3454C26.2598 56.2721 26.1968 56.2316 26.2058 56.1775L26.3994 54.3768C26.3994 54.3273 26.4759 54.2823 26.5615 54.2823H26.9756C27.0567 54.2823 27.1197 54.3273 27.1152 54.3768L26.9216 56.1775C26.9171 56.2496 26.8406 56.2721 26.7595 56.2721Z"
								fill="#407BFF"
							/>
							<path
								opacity="0.4"
								d="M26.7595 56.2721H26.3454C26.2598 56.2721 26.1968 56.2316 26.2058 56.1775L26.3994 54.3768C26.3994 54.3273 26.4759 54.2823 26.5615 54.2823H26.9756C27.0567 54.2823 27.1197 54.3273 27.1152 54.3768L26.9216 56.1775C26.9171 56.2496 26.8406 56.2721 26.7595 56.2721Z"
								fill="black"
							/>
							<path
								d="M27.0701 19.4205L27.7498 19.0874C27.7498 19.0874 27.4797 19.7131 27.0701 19.4205Z"
								fill="#263238"
							/>
							<path
								d="M17.6928 61.6922L20.9206 64.1682L17.1796 64.992C17.1796 64.992 15.5905 63.1913 16.1397 61.7057L17.6928 61.6922Z"
								fill="#FFC3BD"
							/>
							<path
								d="M21.713 67.234L18.5437 67.7517L16.8151 64.5014L20.9207 64.1682L21.713 67.234Z"
								fill="#FFC3BD"
							/>
						</svg>

						{/* circle svg */}
						<svg
							className="absolute top-0 right-0"
							width="30"
							height="30"
							viewBox="0 0 36 36"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<circle
								opacity="0.6"
								cx="18"
								cy="18"
								r="18"
								fill="#F38315"
								fill-opacity="0.4"
							/>
						</svg>
					</div>
					{user.isStudent ? isStudent() : user.isAdmin ? isAdmin() : isTeacher()}				
				</div>
			</div>
		</div>
	);
}
