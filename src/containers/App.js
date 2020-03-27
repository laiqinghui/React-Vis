import React, { Component } from 'react';
import './App.css';
import neo4jConnector from '../dbConnector/neo4jConnector';

import HeaderNavBar from '../components/HeaderNavBar/HeaderNavBar'
import QueryInput from '../components/QueryInput/QueryInput'
import SearchInput from '../components/SearchInput/SearchInput'
import VisGraph from '../components/VisGraph/VisGraph'
import DetailsCard from '../components/DetailsCard/DetailsCard'

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class App extends Component {

    state = {
        query:{
            queryStatement: "",
            type: ""
        }
        
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

    queryInputSubmitHandler = queryStatement => {

        let query = {
            queryStatement: queryStatement,
            type: "reload"
        }

        this.setState({ query: query });
    }

    searchInputSelectHandler = id => {

        console.log("searchInputSelectHandler: ", id)

        let query = {
            queryStatement: this.neo4jc.genQueryStatementByID(id),
            type: "update"
        }

        this.setState({ query: query });
    }

    render() {
        return (
            <div className="App">
                <Container fluid>
                    <Row>
                        <Col>
                            <HeaderNavBar />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <QueryInput
                                submit={this.queryInputSubmitHandler}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <SearchInput
                                dbConnector={this.neo4jc}
                                select={this.searchInputSelectHandler}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={9}>
                            <VisGraph
                                dbConnector={this.neo4jc}
                                nodeOptions={this.nodeOptions}
                                filterFunction={null}
                                query={this.state.query}
                            />
                        </Col>
                        <Col>
                            <DetailsCard />
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }

}

export default App;
