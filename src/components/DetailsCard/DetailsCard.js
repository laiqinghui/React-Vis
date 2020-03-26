import React, { Component } from 'react';
import { connect } from 'react-redux';
import Card from 'react-bootstrap/Card';

class DetailsCard extends Component {

    componentDidUpdate() {

        console.log("[DetailsCard] updated")

    }

    render() {
        return (
            <Card style={{ width: '100%' }}>
                <Card.Body>
                    <Card.Title>{this.props.selectedElementProp !== null ? this.props.selectedElementProp.id : "Nothing Selected."}</Card.Title>
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

const mapStateToProps = state => {
    return {

        selectedElementProp: state.graph.selectedElement,
        graphDataProp: state.graph.graphData

    }
};

export default connect(mapStateToProps, null)(DetailsCard);

