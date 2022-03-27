import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "../landing/Landing";
import Example from "../example/Example";
import Login from "../login/Login";
import Home from "../home/Home";
import Saved from "../saved/Saved";
import Create from "../create/Create";
import User from "../user/User";

import ErrorPopup from "../../components/errorPopup/ErrorPopup";

function App() {
	return (
		<BrowserRouter>
			<ErrorPopup />
			{/* A <Routes> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
			<Routes>
				<Route path="/example" element={<Example />} />
				<Route path="/login" element={<Login />} />
				<Route path="/home" element={<Home />} />
				<Route path="/saved" element={<Saved />} />
				<Route path="/create" element={<Create />} />
				<Route path="/user" element={<User />} />
				<Route path="/" element={<Landing />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
