import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';

class DetailsCard extends Component {

  render(){
    return (
      <Card style={{ width: '100%' }}>
        <Card.Body>
          <Card.Title>Card Title</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle>
          <Card.Text>
            Some quick example text to build on the card title and make up the bulk of
            the card's content.
          </Card.Text>
        </Card.Body>
      </Card>
    )
  }
}

export default DetailsCard;
