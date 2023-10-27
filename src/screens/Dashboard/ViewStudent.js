import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// import Axios from "axios";

const ViewStudent = () => {
	const { courseid, studentusername } = useParams();
	const [student, setStudent] = useState({});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// let source = Axios.CancelToken.source();
		let unmounted = false;
		if (!unmounted) {
			if (loading) {
				// Axios.get(
				// 	`/user/${studentusername}`,
				// 	{ params: studentusername, courseid },
				// 	{ cancelToken: source.token }
				// )
				// 	.then((res) => {
				// 		if (!unmounted) {
				// 			setStudent(res.data);
				// 			setLoading(false);
				// 		}
				// 	})
				// 	.catch((err) => {
				// 		if (!unmounted) {
				// 			if (Axios.isCancel(err)) {
				// 				console.log(`request cancelled:${err.message}`);
				// 			} else {
				// 				console.log("another error happened:" + err.message);
				// 			}
				// 		}
				// 	});
			}
		}
		return function () {
			unmounted = true;
			// source.cancel("Cancelling in cleanup");
		};
	}, [loading, courseid, studentusername]);

	if (!loading) {
		return (
			<div style={{ textAlign: "center" }}>
				<div
					className="card"
					style={{ width: "50rem", textAlign: "center", margin: "auto" }}
				>
					<div className="card-body">
						<h5 className="card-title">Username: {student.username}</h5>
						<h6 className="card-subtitle mb-2 text-muted">Student</h6>
						<p className="card-text">
							Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellat
							ipsam, autem quis eaque, officia distinctio, excepturi impedit
							mollitia dolorum voluptatum in maiores voluptas cumque aut. Alias
							quisquam perspiciatis reiciendis harum.
						</p>
					</div>
				</div>
			</div>
		);
	} else {
		return (
			<div className="spinner-border-container">
				<div className="spinner-border" role="status">
					<span className="visually-hidden">Loading...</span>
				</div>
			</div>
		);
	}
};

export default ViewStudent;
