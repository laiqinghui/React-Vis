import { createReducer } from '@reduxjs/toolkit'
import * as actionTypes from '../actions/actions';

const initialState = {
    selectedElement: {
        id: null,
        type: null
    },
    graphData: {
        nodes: [],
        edges: []
    }
};

/*
    Note that createReducer from Redux toolkit is used here to take advantage of the simplified immutable update logic (remove
    the need of manual deep copy). 
    The createReducer utility uses Immer internally. Because of this, we can write reducers that appear to "mutate" state, 
    but the updates are actually applied immutably.

    More info: https://redux.js.org/recipes/structuring-reducers/immutable-update-patterns/#simplifying-immutable-updates-with-redux-toolkit
 */

const reducer = createReducer(initialState, {

    [actionTypes.UPDATE_SELECTED_ELEMENT]: (state, action) => {
        state.selectedElement = action.newElement;
    },
    [actionTypes.UPDATE_GRAPH_DATA]: (state, action) => {
        state.graphData = action.newGraphData;
    }

})

export default reducer;