import React, { Component } from 'react';
import { connect } from 'react-redux';
import DateRangeSlider from '../components/DateRangeSlider/DateRangeSlider' 


class Filter extends Component {

    state = {

        dateLeft: null,
        dateRight: null

    }

    componentDidUpdate() {

        console.log("[Filter] updated")

    }

    sliderChange = (left, right) => {

        console.log(left);
        console.log(right);
        this.setState({

            dateLeft: left,
            dateRight: right
    
        })
    }

    getMinMaxDate = data => {

        let mindateobj = new Date();
        let maxdateobj = new Date("1970-01-01");
        let maxistoday = false;

        let checkMinMax = objs => {

            objs.forEach(obs => {

                if (obs.term_start.length > 0){

                    if (new Date(obs.term_start) < mindateobj){

                        mindateobj = new Date(obs.term_start);

                    }

                    // Skip checking term_end if max date is set to today
                    if (maxistoday === false){

                        if (obs.term_end.length > 0){

                            if (new Date(obs.term_end) > maxdateobj){

                                maxdateobj = new Date(obs.term_end);

                            }

                        } else {

                            // Set max date to today if term_start is set but term_end is not set
                            maxdateobj = new Date();
                            maxistoday = true;

                        }

                    }
                    
                }

            });

        } 

        checkMinMax(data.nodes);
        checkMinMax(data.edges);

        return {min: mindateobj, max: maxdateobj};

    }


    render() {

        let currentMinMaxDate = this.getMinMaxDate(this.props.graphDataProp);
        
        // if(this.props.graphDataProp.nodes.length > 0){
        //     currentMinMaxDate = this.getMinMaxDate(this.props.graphDataProp)
        // } else{

        //     currentMinMaxDate = {
        //         min: new Date("2019-01-01"),
        //         max: new Date("2020-01-01")

        //     }
        // }

        console.log('min: ', currentMinMaxDate.min)
        console.log('max: ', currentMinMaxDate.max)

       
        return (
            <DateRangeSlider
                minDate = {currentMinMaxDate.min}
                maxDate = {currentMinMaxDate.max}
                step = {24*60*60}
                default = {{left: currentMinMaxDate.min, right: currentMinMaxDate.max}}
                change = {this.sliderChange}
            />
        )
    }
}

const mapStateToProps = state => {

    return {

        graphDataProp: state.graph.graphData

    }
};

export default connect(mapStateToProps, null)(Filter);

