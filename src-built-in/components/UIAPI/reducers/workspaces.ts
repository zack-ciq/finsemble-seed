import { WorkspaceState, WorskpaceActions, ActionTypes } from '../types';
import withLogging from '../hoReducers/logging';

export const initialState: WorkspaceState = {
	activeWorkspace: {
		name: null
	}
};

export const workspaces = (state: WorkspaceState = initialState, action: WorskpaceActions) => {
	const { type, payload } = action;
	switch (type) {
		case ActionTypes.SET_ACTIVE_WORKSPACE:
			return {
				...state,
				activeWorkspace: {
					name: payload.name
				}
			}
		default:
			return state;
	}
}

// Wraps the reducer with some logging so that we can debug
// field reported bugs.
export default withLogging("Workspaces", workspaces);