import React, { Component } from 'react';
import logo from '../logo.svg';
import './App.css';

import HeaderNavBar from '../HeaderNavBar/HeaderNavBar'
import QueryInput from '../QueryInput/QueryInput'
import VisGraph from '../VisGraph/VisGraph'
import DetailsCard from '../DetailsCard/DetailsCard'

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class App extends Component {


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
              <QueryInput/>
            </Col>
          </Row>
          <Row>
            <Col xs={9}>
              <VisGraph/>
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
