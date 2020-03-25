import React from 'react';
import Navbar from 'react-bootstrap/Navbar';

const HeaderNavBar = (props) => {

  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand href="#home">
        Graph Data Visualizer
      </Navbar.Brand>
    </Navbar>
  )  

}

export default HeaderNavBar;
