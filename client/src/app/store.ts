import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import counterReducer from "../components/counter/counterSlice";
import sceneReducer from "../components/scene/sceneSlice";
import searchReducer from "../components/searchBar/searchSlice";
import modalReducer from "../components/recipeModal/modalSlice";
import errorReducer from "../components/errorPopup/errorSlice";

export const store = configureStore({
	reducer: {
		counter: counterReducer,
		scene: sceneReducer,
		search: searchReducer,
		modal: modalReducer,
		error: errorReducer,
	},
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	unknown,
	Action<string>
>;
