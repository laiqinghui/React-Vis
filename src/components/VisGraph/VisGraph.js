import React, { Component } from 'react';
import { connect } from 'react-redux';
import Graph from 'react-graph-vis'
import visDriver from '../../VisDriver'
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
            var { nodes, edges } = event;
            console.log(nodes);
            console.log(edges);
            this.props.updateSelectedElementState({
                id: nodes[0],
                type: "node"
            })
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
                // style={style}
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
        updateSelectedElementState: (selectedElement) => dispatch(actionCreators.updateSelectedElement(selectedElement)),
        updategraphDataState: (graphData) => dispatch(actionCreators.updateGraphData(graphData))
    }
};

export default connect(null, mapDispatchToProps)(VisGraph);


