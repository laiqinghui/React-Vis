import React, { Component } from 'react';
import './App.css';
import neo4jConnector from '../dbConnector/neo4jConnector';

import HeaderNavBar from '../components/HeaderNavBar/HeaderNavBar'
import QueryInput from '../components/QueryInput/QueryInput'
import VisGraph from '../components/VisGraph/VisGraph'
import DetailsCard from '../components/DetailsCard/DetailsCard'

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class App extends Component {

    state = {
        queryStatement: ""
    }

    // ---------------------------------------------User-defined parameters------------------------------------------------- 
    
    neo4jc = new neo4jConnector("192.168.1.42", 11006, "neo4j", "password");

    // All these will be made user configurable via UI components in the future
    nodeOptions = {

        nodesColorMap: {

            "T1Person": "#f76a8c",
            "T2Person": "#a6b1e1",
            "T3Person": "#1eb2a6",
            "MilitaryLeader": "#a7e9af"
    
        },
        
        nodeSizeMap: {
    
            "T1Person": 3,
            "T2Person": 2,
            "T3Person": 1,
            "MilitaryLeader": 1
    
        }

    }

    // ---------------------------------------------------------------------------------------------------------------------

    queryInputSubmitHandler = query => {
        this.setState({queryStatement: query});
    }

    selectNodeEdgeHandler = (id, data) => {

    }

    render() {
    return (
        <div className="App">
        <Container fluid>
            <Row>
            <Col>
                <HeaderNavBar/>
            </Col>
            </Row>
            <Row>
            <Col>
                <QueryInput
                submit = {this.queryInputSubmitHandler}
                />
            </Col>
            </Row>
            <Row>
            <Col xs={9}>
                <VisGraph
                dbConnector = {this.neo4jc}
                nodeOptions = {this.nodeOptions}
                filterFunction = {null}
                queryStatement = {this.state.queryStatement}
                />
            </Col>
            <Col>
                <DetailsCard/>
            </Col>
            </Row>
        </Container>
        </div>
    );
    }

}

export default App;
