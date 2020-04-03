import React, { Component } from 'react';
import { connect } from 'react-redux';
import Graph from 'react-graph-vis'
import './VisGraph.css';
import visDriver from '../../VisDriver'
import { cloneDeep } from 'lodash'
import ProgressCircle from '../ProgressCircle/ProgressCircle'
import CenterFocusWeakRoundedIcon from '@material-ui/icons/CenterFocusWeakRounded';
import DeleteForeverRoundedIcon from '@material-ui/icons/DeleteForeverRounded';


import * as actionCreators from '../../store/actions/actions';


class VisGraph extends Component {

    visDriver = null;
    visRef = null;

    state = {
        stabilizedPercentage: 0
    }

    componentDidMount() {

        this.visDriver = new visDriver(this.visRef, this.props.dbConnector, this.props.nodeOptions)

    }

    componentDidUpdate(prevProps, prevState) {

        // console.log("[VisGraph] updated")

        if (this.props.dateFilter !== prevProps.dateFilter) {

            this.visDriver.setDataFilter(this.props.dateFilter);
            this.visDriver.setFocusNode(null);
            this.visDriver.setAndRenderGraphData();
        }

        // Include this check incase there is added internal states in the future
        if (this.props.query !== prevProps.query) {

            if (this.props.query.type === 'reload') {

                this.visDriver.reloadGraph(this.props.query.queryStatement)
                    .then(graphData => {
                        console.log("Reloaded!")
                        this.props.updategraphDataState(graphData);

                    })
                    .catch(errorResponse => {

                        console.log("Failed in connecting to database")
                        console.log(errorResponse)

                    })

            } else if (this.props.query.type === 'update') {

                this.visDriver.updateGraph(this.props.query.queryStatement, null)
                    .then(graphData => {
                        console.log("Updated!")
                        this.props.updategraphDataState(graphData);

                    })
                    .catch(errorResponse => {

                        console.log("Failed in connecting to database")
                        console.log(errorResponse)

                    })


            }

        }

    }

    focusIconHandler = () => {

        this.visDriver.turnOnPhysics(this.physicsOnOpt);
        this.visDriver.focusGraph();

    }

    clearGraphIconHandler = () => {

        this.visDriver.clearGraph();

    }

    events = {
        select: event => {
            console.log("Selected!");

            let { nodes, edges } = event;

            if (nodes.length > 0) {

                this.props.updateSelectedElementState({
                    id: nodes[0],
                    type: "node"
                })

            } else if (edges.length > 0) {

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

            if (nodes.length > 0) {

                let query = this.props.dbConnector.genQueryStatementByID(nodes[0], true);
                // this.visDriver.turnOnPhysics();
                this.visDriver.updateGraph(query, nodes[0]).then(graphData => {

                    this.props.updategraphDataState(graphData);

                })
                    .catch(errorResponse => {

                        console.log("Failed in connecting to database")
                        console.log(errorResponse)

                    })

            }

        },
        stabilizationProgress: event => {
            // console.log("stabilizationProgress: " + event.iterations + "/" + event.total);
            this.setState({ stabilizedPercentage: Math.round((event.iterations / event.total) * 100) });
            if (event.iterations === event.total) {

                this.visDriver.turnOffPhysics();
                this.setState({ stabilizedPercentage: 0 });

            }

        },
        stabilized: event => {

            //For early stabilization
            console.log("Stabilized after " + event.iterations + " iterations.")
            this.setState({ stabilizedPercentage: 0 });
            this.visDriver.turnOffPhysics();

        }
    };

    render() {
        return (
            <div>

                <Graph
                    graph={{
                        nodes: [],
                        edges: []
                    }}
                    events={this.events}
                    style={{ "backgroundColor": "#F8F9FB", "border": "1px solid lightgray", "height": "650px" }}
                    getEdges={this.getEdges}
                    getNodes={this.getNodes}
                    getNetwork={network => {
                        this.visRef = network;
                    }}
                />

                <div className = {"CanvasInputs"}>
                    <CenterFocusWeakRoundedIcon onClick={this.focusIconHandler} color={"disabled"} />
                    <DeleteForeverRoundedIcon onClick={this.clearGraphIconHandler} color={"disabled"} />
                </div>

                {
                    this.state.stabilizedPercentage === 0 ? null :
                        (<div style={{ position: "absolute", top: "50%", left: "50%", marginRight: "-50%", transform: "translate(-50%, -50%)" }}>
                            <ProgressCircle
                                progress={this.state.stabilizedPercentage}
                            />
                        </div>)
                }
            </div>
        )
    }

}


const mapStateToProps = state => {
    return {

        dateFilter: state.filter.dateFilter

    }
};

const mapDispatchToProps = dispatch => {
    return {
        // Pass in deep clones of objects as we don't want reducers to work with the original objects
        updateSelectedElementState: (selectedElement) => dispatch(actionCreators.updateSelectedElement(cloneDeep(selectedElement))),
        updategraphDataState: (graphData) => dispatch(actionCreators.updateGraphData(cloneDeep(graphData)))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(VisGraph);


