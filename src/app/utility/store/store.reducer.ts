// store.reducer.ts

import { createAction, createReducer, on, props } from '@ngrx/store';

// Define actions

export const changesAppTheme = createAction('[App Theme] Change', props<{ theme: string }>());

// Define initial state

export interface State {
	appTheme: string;
}

export const initialState: State = {
	appTheme: "",
};

// Define storeReducer
export const storeReducer = createReducer(
	initialState,
	on(changesAppTheme, (state, { theme }) => ({ ...state, appTheme: theme })),
);


// Define AppState
export interface AppState {
	store: State;
}
