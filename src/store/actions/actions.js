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