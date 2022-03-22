import { Box, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState } from "react";
import { useAppSelector } from "../../app/hooks";

import Scene from "../../components/scene/Scene";
import { selectTime } from "../../components/scene/sceneSlice";
import { NewUser } from "../../api/models";

import { LoginForm } from "./Forms/LoginForm";
import { SignupForm } from "./Forms/SignupForm";
import { ValidForm } from "./Forms/ValidForm";
import { Link } from "react-router-dom";

// This will include both login and signup
const userInfo: NewUser = {
	username: "",
	firstName: "",
	lastName: "",
	password: "",
	email: "",
};

export default function Login() {
	const time = useAppSelector(selectTime);
	const [useValid, setUseValid] = useState(false);

	return (
		<>
			<Scene />
			<Box
				component="div"
				sx={{
					position: "absolute",
					height: "100vh",
					width: "100vw",
					top: 0,
					overflow: "hidden",
				}}
			>
				<Button
					component={Link}
					to="/"
					sx={{ position: "absolute", right: "0" }}
				>
					<CloseIcon
						sx={{
							color: "white",
							fontSize: "50px",
						}}
					/>
				</Button>

				<Box
					component="div"
					className={time === "dawn" ? "lower" : ""}
					sx={{
						"&.lower": {
							transform: "translateY(100vh)",
						},
						position: "absolute",
						width: "100%",
						height: "100%",
						transition: "transform 1s ease",
						display: "flex",
						alignItems: "center",
					}}
				>
					{useValid ? (
						<ValidForm userInfo={userInfo} />
					) : (
						<LoginForm />
					)}
				</Box>
				<Box
					component="div"
					className={time === "dawn" ? "lower" : ""}
					sx={{
						"&.lower": {
							transform: "translateY(100vh)",
						},
						position: "absolute",
						width: "100%",
						height: "100%",
						transition: "transform 1s ease",
						display: "flex",
						alignItems: "center",
						top: "-100%",
					}}
				>
					<SignupForm userInfo={userInfo} setUseValid={setUseValid} />
				</Box>
			</Box>
		</>
	);
}
