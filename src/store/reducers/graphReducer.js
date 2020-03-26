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

const reducer = createReducer(initialState, {

    [actionTypes.UPDATE_SELECTED_ELEMENT]: (state, action) => {
        state.selectedElement = action.newElement;
    },
    [actionTypes.UPDATE_GRAPH_DATA]: (state, action) => {
        state.graphData = action.newGraphData;
    }
    
  })

export default reducer;