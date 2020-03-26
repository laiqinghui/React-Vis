import React, { Component } from 'react';
import { connect } from 'react-redux';
import Graph from 'react-graph-vis'
import visDriver from '../../VisDriver'
import * as actionCreators from '../../store/actions/actions';


class VisGraph extends Component {

    visDriver = null;
    visRef = null;

    state = {
        prevQuery: null
    }

    componentDidMount() {

        this.visDriver = new visDriver(this.visRef, this.props.dbConnector, this.props.filterFunction, this.props.nodeOptions)

    }

    componentDidUpdate() {

        console.log("[VisGraph] updated")

        if (this.props.queryStatement !== this.state.prevQuery) {

            this.visDriver.reloadGraph(this.props.queryStatement);
            this.setState({prevQuery: this.props.queryStatement})
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
                //options={this.options}
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


const mapStateToProps = state => {
    return {

        selectedElementProp: state.graph.selectedElement,
        graphDataProp: state.graph.graphData

    }
};

const mapDispatchToProps = dispatch => {
    return {
        updateSelectedElementState: (selectedElement) => dispatch(actionCreators.updateSelectedElement(selectedElement)),
        updategraphDataState: (graphData) => dispatch(actionCreators.updateGraphData(graphData))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(VisGraph);


