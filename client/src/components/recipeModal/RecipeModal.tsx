import {
	Modal,
	Backdrop,
	Fade,
	Typography,
	Box,
	CardMedia,
	Container,
	IconButton,
	LinearProgress,
	Tooltip,
	Dialog,
	DialogTitle,
	Button,
	DialogActions,
	Checkbox,
	Link,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Scrollbars } from "react-custom-scrollbars";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { closeModal, selectModal, setDeleted } from "./modalSlice";

import { Recipe, Nutrient } from "../../api/models";
import Tag from "../tag/Tag";
import { deleteRecipe, getRecipe } from "../../api/requests";

import {
	Edit as EditIcon,
	DeleteForever as DeleteIcon,
	FavoriteBorder as Unfavorited,
	Favorite as Favorited,
} from "@mui/icons-material";
import { store } from "../../app/store";
import { setRecipe } from "./recipeSlice";

import { useNavigate } from "react-router";
import { setCreationEditing } from "../../pages/create/creationUpdateSlice";
import { openError, setError } from "../errorPopup/errorSlice";
import { selectFavoriteByID, updateFavorite } from "../userFavs/favSlice";

import { decimalToFraction } from "./UnitFormat";

interface contentProps {
	recipe: Recipe;
	setOpenDeleteDialog: Function;
}

function RecipeModalContent({ recipe, setOpenDeleteDialog }: contentProps) {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const recipeID =
		recipe.cookbookID === "100000000000000000000000"
			? "" + recipe.spoonacularID
			: recipe.cookbookID;

	const formatAmounts = true;
	//recipe.cookbookID === "100000000000000000000000" ? true : false;

	const [canEdit, setCanEdit] = useState(false);
	const [selectedIng, setSelectedIng] = useState<number[]>([]);

	const label = { inputProps: { "aria-label": "Ingredient checkbox" } };
	if (recipe == undefined) {
		recipe = dataA;
	}

	const isFavorited: boolean = useAppSelector(selectFavoriteByID(recipeID));

	useEffect(() => {
		const userID = store.getState().user.user.userID;
		setCanEdit(recipe.authorID === userID);
	}, []);

	const doEdit = () => {
		dispatch(setRecipe(recipe));
		dispatch(setCreationEditing(recipe.cookbookID));
		dispatch(closeModal());
		navigate("/create");
	};

	const doDelete = () => {
		setOpenDeleteDialog(true);
	};

	const toggleFav = () => {
		dispatch(updateFavorite({ id: recipeID, set: !isFavorited }));
	};

	const importantNutrients = [
		"Calories",
		"Calcium",
		"Carbohydrates",
		"Sugar",
		"Fiber",
		"Cholesterol",
		"Fat",
		"Sodium",
		"Saturated Fat",
		"Vitamin C",
		"Protein",
		"Vitamin B",
	];

	interface NutritionProps {
		nutrients: Nutrient[];
	}
	const boxShadowProps = "0px 3px 3px #D1D1C4";
	class NutritionFacts extends React.Component<NutritionProps, {}> {
		render() {
			return (
				<Box
					component="div"
					sx={{
						backgroundColor: "primary.light",
						boxShadow: boxShadowProps,
						p: "16px",
						mb: "8px",
						borderRadius: "8px",
					}}
				>
					<Container disableGutters style={{}}>
						<Typography
							variant="h6"
							component="h6"
							fontWeight={700}
						>
							Nutrition
						</Typography>
						{this.props.nutrients.map((nutrient, i) =>
							!importantNutrients.includes(nutrient.name) ||
							(nutrient?.percentOfDailyNeeds < 1 &&
								(nutrient.amount as string) === "") ? (
								<></>
							) : (
								<Typography
									key={"nutri" + i}
									variant="body1"
									component="h5"
								>
									{/* Includes Daily Value for spoon recipes */}
									{`${nutrient.name}: ${nutrient.amount}` +
										(nutrient.percentOfDailyNeeds > 1
											? `${Math.round(
													nutrient?.percentOfDailyNeeds
											  )}% DV`
											: "")}
								</Typography>
							)
						)}
					</Container>
				</Box>
			);
		}
	}

	return (
		<Box
			component="div"
			sx={{
				position: "absolute",
				top: "50%",
				left: "50%",
				transform: "translate(-50%, -50%)",
				minWidth: "180px",
				width: "60%",
				height: "80%",
				maxHeight: "100%",
				bgcolor: "primary.main",
				border: "2px solid #fff",
				borderRadius: "20px",
				boxShadow: 12,
				overflowX: "hidden",
				overflowY: "auto",
				scrollbarWidth: "none",
			}}
		>
			<Scrollbars
				renderTrackHorizontal={() => <div></div>}
				renderThumbHorizontal={() => <div></div>}
				thumbSize={180}
				style={{ height: "100%", overflowX: "hidden" }}
			>
				{/* TITLE, SUBTITLE, BUTTONS */}
				<Box
					component="div"
					sx={{
						backgroundColor: "#202020",
						top: 0,
						//borderRadius: "20px 20px 0px 0px",
						width: "100%",
						height: "60%",
						maxHeight: "70%",
						minHeight: "160px",
						// position: "sticky",
						display: "flex",
						flexDirection: "column",
						alignItems: "flex-end",
						justifyContent: "flex-end",
						overflow: "hidden",
						position: "relative",
					}}
				>
					<CardMedia
						component="img"
						sx={{
							position: "absolute",
							justifySelf: "center",
							height: "450px",
							//mixBlendMode: "soft-light",
							opacity: "50%",
							objectFit: "cover",
							width: "100%",
							zIndex: "modal",
							overflow: "hidden",
						}}
						image={
							recipe.imageURL && recipe.imageURL != ""
								? recipe.imageURL
								: "https://source.unsplash.com/random"
						}
						alt="food image"
					/>

					<Container
						disableGutters
						sx={{ zIndex: "tooltip", pl: "32px" }}
					>
						<Typography
							variant="h3"
							component="h3"
							className="Title"
						>
							{recipe.name}
						</Typography>
						<Typography
							variant="h6"
							component="h6"
							sx={{
								//position: "relative",
								color: "primary.contrastText",
							}}
						>
							{recipe.author === ""
								? ""
								: `By ${recipe.author} – `}{" "}
							Ready in {recipe.totalTime}m
						</Typography>
					</Container>
					<Container
						disableGutters
						sx={{ pl: "24px", zIndex: "tooltip", pb: "16px" }}
					>
						{/* EDIT AND DELETE MENU */}
						<Tooltip
							title={
								isFavorited ? "Unfavorite" : "Add to favorites"
							}
						>
							<IconButton
								aria-label="favorite"
								disableRipple
								onClick={toggleFav}
								className="Menu"
								sx={{
									margin: "0px",
								}}
							>
								{isFavorited ? (
									<Favorited
										sx={{
											margin: "0px",
											borderWidth: "0",
											color: "secondary.main",
										}}
									/>
								) : (
									<Unfavorited
										sx={{
											color: "primary.contrastText",
										}}
									/>
								)}
							</IconButton>
						</Tooltip>
						{canEdit ? (
							<>
								<Tooltip title="Edit recipe">
									<IconButton
										disableRipple
										className="Menu"
										onClick={doEdit}
									>
										<EditIcon
											sx={{
												color: "primary.contrastText",
											}}
										/>
									</IconButton>
								</Tooltip>
								<Tooltip title="Delete recipe">
									<IconButton
										disableRipple
										className="Menu"
										onClick={doDelete}
									>
										<DeleteIcon
											sx={{
												color: "primary.contrastText",
											}}
										/>
									</IconButton>
								</Tooltip>
							</>
						) : (
							<></>
						)}
					</Container>
				</Box>
				<Container disableGutters sx={{ display: "flex" }}>
					<Container
						disableGutters
						sx={{
							width: "45%",
							minWidth: "35%",
							flex: 2,
							minHeight: "40%",
							height: "auto",
							py: "16px",
							pl: "16px",
						}}
					>
						{/* REQUIRED INGREDIENTS */}
						<Box
							component="div"
							sx={{
								backgroundColor: "primary.light",
								boxShadow: boxShadowProps,
								p: "16px",
								mb: "8px",
								borderRadius: "8px",
							}}
						>
							<Typography
								variant="h6"
								component="h6"
								fontWeight={700}
							>
								Ingredients
							</Typography>
							<Container disableGutters>
								{recipe.ingredients?.map((ingredient, i) => (
									<Typography
										key={ingredient.name}
										variant="body1"
										component="h5"
										color={
											selectedIng.indexOf(i) > -1
												? "primary.dark"
												: "primary.darkContrastText"
										}
										sx={{
											p: "1px",
										}}
									>
										<Checkbox
											{...label}
											sx={{ mt: "-4px", ml: "-8px" }}
											onChange={() => {
												if (
													selectedIng.indexOf(i) ===
													-1
												) {
													setSelectedIng([
														...selectedIng,
														i,
													]);
												} else {
													const tmpSelectedIng = [
														...selectedIng,
													];
													tmpSelectedIng.splice(
														tmpSelectedIng.indexOf(
															i
														),
														1
													);
													setSelectedIng(
														tmpSelectedIng
													);
												}
											}}
										/>
										{ingredient.name}:{" "}
										{formatAmounts
											? decimalToFraction(
													ingredient.amount
											  )
											: ingredient.amount}
										{"\u00A0"}
										{ingredient.unit}
									</Typography>
								))}
							</Container>
						</Box>

						{/* NUTRITION */}
						<Box component="div">
							{recipe.nutrients?.filter((x) => x.amount !== "")
								.length === 0 ? (
								<NutritionFacts nutrients={recipe.nutrients} />
							) : (
								<></>
							)}
						</Box>

						{/* TAGS */}
					</Container>
					{/* INSTRUCTIONS */}
					<Container
						disableGutters
						sx={{
							display: "flex",
							flex: 3,
							flexDirection: "column",
							width: "auto",
							padding: "16px",
							pl: "8px",
							height: "100%",
						}}
					>
						{/* right panels */}
						<Box
							component="div"
							sx={{
								backgroundColor: "primary.light",
								boxShadow: boxShadowProps,
								p: "16px",
								borderRadius: "8px",
							}}
						>
							{/* <Typography
							variant="h6"
							component="h6"
							sx={{
								position: "relative",
								color: "primary.contrastText",
							}}
						>
							{recipe.prepTime === -1
								? ""
								: `${recipe.prepTime}m Prep Time – ${recipe.cookTime}m Cook Time`}
						</Typography> */}

							{recipe.instructions !== null &&
							recipe.instructions.length > 0 ? (
								<Container disableGutters>
									<Typography
										variant="h6"
										component="h6"
										fontWeight={700}
									>
										Instructions
									</Typography>
									{recipe.instructions?.map(
										(instruction, i) => (
											<Typography
												key={"instruction-" + i}
												variant="body1"
												component="h5"
												sx={{
													pb: "10px",
													//height: "2em",
													//p: "1px",
												}}
											>
												{i + 1}.{" "}
												{instruction.description}
											</Typography>
										)
									)}
								</Container>
							) : (
								<></>
							)}
						</Box>

						{recipe.url ? (
							<Box
								component="div"
								sx={{
									backgroundColor: "primary.light",
									boxShadow: boxShadowProps,
									p: "16px",
									mt: "8px",
									borderRadius: "8px",
									width: "100%",
								}}
							>
								<Typography
									key="text"
									variant="body1"
									component="h5"
									sx={{
										p: "1px",
									}}
								>
									<Link
										href={recipe.url}
										underline="always"
										sx={{
											color: "secondary.dark",
											fontWeight: "bold",
										}}
									>
										Open original recipe (leaves Clove)
									</Link>
								</Typography>
							</Box>
						) : (
							<></>
						)}
						{recipe.tags?.length != 0 ? (
							<Container
								disableGutters
								sx={{
									backgroundColor: "primary.light",
									boxShadow: boxShadowProps,
									p: "16px",
									mt: "8px",
									borderRadius: "8px",
									width: "100%",
								}}
							>
								<Typography
									variant="h6"
									component="h6"
									fontWeight={700}
								>
									Tags
								</Typography>
								<Container
									disableGutters
									sx={{
										display: "flex",
										flexWrap: "wrap",
										width: "auto",
										// ml: "-10px",
									}}
								>
									{recipe.tags?.map((tag, i) => (
										<Tag name={tag} key={tag + i} />
									))}
								</Container>
							</Container>
						) : (
							<></>
						)}
					</Container>
				</Container>
			</Scrollbars>
		</Box>
	);
}

function DeleteDialog({ id, setOpen }: { id: string; setOpen: Function }) {
	const dispatch = useAppDispatch();

	const handleClose = () => {
		setOpen(false);
	};

	const deleteDialog = () => {
		deleteRecipe(id);
		dispatch(setDeleted(true));
		dispatch(closeModal());
		setOpen(false);
	};

	return (
		<Dialog open={true} onClose={handleClose}>
			<DialogTitle>Delete recipe permanently?</DialogTitle>
			<DialogActions>
				<Button onClick={handleClose}>Cancel</Button>
				<Button onClick={deleteDialog} variant="outlined" color="error">
					Delete
				</Button>
			</DialogActions>
		</Dialog>
	);
}

const dataA: Recipe = {
	cookbookID: "000000000000000000000000",
	spoonacularID: 0,
	ingredients: [
		{ name: "Spinach", amount: 1, unit: "cup" },
		{ name: "Grass", amount: 2, unit: "oz" },
		{ name: "Cheese", amount: 5, unit: "mb" },
	],
	instructions: [],
	name: "Chicken Paella",
	updatedAt: "5:04 PM, Friday 14th 2021",
	author: "jo",
	authorID: "1231",
	imageURL: "https://picsum.photos/200",
	totalTime: 15,
	tags: ["chicken", "mars", "vegan"],
	cookTime: 5,
	prepTime: 10,
	createdAt: "5:04 PM, Friday 14th 2021",
	nutrients: [],
};

function RecipeModal() {
	const dispatch = useAppDispatch();
	const handleClose = () => dispatch(closeModal());

	const modalInfo = useAppSelector(selectModal);
	const open = modalInfo.isOpen;

	const [recipe, setRecipe] = useState<Recipe>(dataA);
	const [loading, setLoading] = useState(true);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

	useEffect(() => {
		if (open) {
			setLoading(true);
			getRecipe("" + modalInfo.id).then((data) => {
				console.log(data);
				if (data !== undefined && data.name !== "") {
					setRecipe(data);
					setLoading(false);
				} else {
					dispatch(setError("Error: Could not load recipe"));
					dispatch(openError());
				}
			});
		}
	}, [open]);

	return (
		<div>
			<Modal
				aria-labelledby="recipeModal"
				aria-describedby="recipeModalDesc"
				open={open}
				onClose={handleClose}
				closeAfterTransition
				BackdropComponent={Backdrop}
				BackdropProps={{ timeout: 500 }}
			>
				<Fade in={open}>
					<div>
						{loading ? (
							<LinearProgress />
						) : openDeleteDialog ? (
							<DeleteDialog
								id={recipe.cookbookID}
								setOpen={setOpenDeleteDialog}
							/>
						) : (
							<RecipeModalContent
								recipe={recipe}
								setOpenDeleteDialog={setOpenDeleteDialog}
							/>
						)}
					</div>
				</Fade>
			</Modal>
		</div>
	);
}

export default RecipeModal;
