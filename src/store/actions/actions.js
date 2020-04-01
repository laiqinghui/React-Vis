export const UPDATE_SELECTED_ELEMENT = 'UPDATE_SELECTED_ELEMENT';
export const UPDATE_GRAPH_DATA = 'UPDATE_GRAPH_DATA';

export const updateSelectedElement = ( newElement ) => {
    return {
        type: UPDATE_SELECTED_ELEMENT,
        newElement: newElement
    };
};

export const updateGraphData = ( newGraphData ) => {
    return {
        type: UPDATE_GRAPH_DATA,
        newGraphData: newGraphData
    };
};


export const UPDATE_FILTER = 'UPDATE_FILTER';
export const UPDATE_FILTER_ARGUMENTS = 'UPDATE_FILTER_ARGUMENTS';

export const updateFilter = ( filterKey, filter ) => {
    return {
        type: UPDATE_FILTER,
        filterKey: filterKey,
        filter: filter
    };
};

export const updateFilterArguments = ( filterKey, filterArguments) => {
    return {
        type: UPDATE_FILTER_ARGUMENTS,
        filterKey: filterKey,
        filterArguments: filterArguments
    };
};
