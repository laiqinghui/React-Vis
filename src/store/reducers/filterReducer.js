import { createReducer } from '@reduxjs/toolkit'
import * as actionTypes from '../actions/actions';

const initialState = {

    dateFilter: {
        func: null,
        arg: null
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

    [actionTypes.UPDATE_FILTER]: (state, action) => {
        state[action.filterKey] = action.filter;
    },
    [actionTypes.UPDATE_FILTER_ARGUMENTS]: (state, action) => {
        state[action.filterKey]['arg'] = action.filterArguments;
    }

})

export default reducer;