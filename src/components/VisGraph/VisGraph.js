import React, { Component } from 'react';
import { connect } from 'react-redux';
import Graph from 'react-graph-vis'
import visDriver from '../../VisDriver'
import {cloneDeep} from 'lodash'
import * as actionCreators from '../../store/actions/actions';


class VisGraph extends Component {

    visDriver = null;
    visRef = null;

    state = {

    }

    componentDidMount() {

        this.visDriver = new visDriver(this.visRef, this.props.dbConnector, this.props.filterFunction, this.props.nodeOptions)

    }

    componentDidUpdate(prevProps, prevState) {

        console.log("[VisGraph] updated")

        // Include this check incase there is added internal states in the future
        if (this.props.query !== prevProps.query) {

            if (this.props.query.type === 'reload'){

                this.visDriver.reloadGraph(this.props.query.queryStatement)
                .then(graphData => {

                    this.props.updategraphDataState(graphData);

                })
                .catch(errorResponse => {

                    console.log("Failed in connecting to database")
                    console.log(errorResponse)

                })    

            } else if(this.props.query.type === 'update'){

                this.visDriver.updateGraph(this.props.query.queryStatement, null)
                .then(graphData => {

                    this.props.updategraphDataState(graphData);

                })
                .catch(errorResponse => {

                    console.log("Failed in connecting to database")
                    console.log(errorResponse)

                })    


            }

            
;
        }

    }


    events = {
        select: event => {
            console.log("Selected!");
            let { nodes, edges } = event;

            if (nodes.length > 0){

                this.props.updateSelectedElementState({
                    id: nodes[0],
                    type: "node"
                })

            } else if(edges.length > 0){

                this.props.updateSelectedElementState({
                    id: edges[0],
                    type: "edge"
                })

            } else {

                this.props.updateSelectedElementState({
                    id: null,
                    type: null
                })

            }
        },
        doubleClick: event => {

            let { nodes } = event;

            if (nodes.length > 0){

                let query = this.props.dbConnector.genQueryStatementByID(nodes[0], true);
                this.visDriver.updateGraph(query, nodes[0]).then(graphData => {

                    this.props.updategraphDataState(graphData);

                })
                .catch(errorResponse => {

                    console.log("Failed in connecting to database")
                    console.log(errorResponse)

                })    

            }

        }
    };

    render() {
        return (
            <Graph
                graph={ {
                    nodes: [],
                    edges: []
                } }
                events={this.events}
                style={{"backgroundColor": "#F8F9FB", "border": "1px solid lightgray", "height": "650px"}}
                getEdges={this.getEdges}
                getNodes={this.getNodes}
                getNetwork={network => {
                    this.visRef = network;
                }}
            />
        )
    }

}


// const mapStateToProps = state => {
//     return {

//         selectedElementProp: state.graph.selectedElement,
//         graphDataProp: state.graph.graphData

//     }
// };

const mapDispatchToProps = dispatch => {
    return {
        // Pass in deep clones of objects as we don't want reducers to work with the original objects
        updateSelectedElementState: (selectedElement) => dispatch(actionCreators.updateSelectedElement(cloneDeep(selectedElement))),
        updategraphDataState: (graphData) => dispatch(actionCreators.updateGraphData(cloneDeep(graphData)))
    }
};

export default connect(null, mapDispatchToProps)(VisGraph);


