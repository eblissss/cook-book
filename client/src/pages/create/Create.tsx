import { Box } from "@mui/material";
import React from "react";

import { TabBar } from "../../components/tabBar/TabBar";

function Create() {
	return (
		<>
			<TabBar tab="create" />
			<Box
				component="div"
				sx={{
					position: "relative",
					minHeight: "calc(100vh - 59px)",
					width: "100vw",
					top: "59px",
					backgroundColor: "primary.light",
				}}
			></Box>
		</>
	);
}

export default Create;
