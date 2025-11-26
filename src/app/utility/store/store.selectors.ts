// store.selectors.ts

import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState, State } from './store.reducer';

// 1. Feature selector for 'store' slice
export const selectStoreState = createFeatureSelector<State>('store');

// 2. Selectors for each state property

export const selectAppTheme = createSelector(
	selectStoreState,
	(state) => state.appTheme
);