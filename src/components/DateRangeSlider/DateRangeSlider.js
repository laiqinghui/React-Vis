import React, { Component } from 'react';
import Slider from '@material-ui/core/Slider';
import { withStyles} from '@material-ui/core/styles';

class DateRangeSlider extends Component {


    state = {

        valLeft: this.props.default.left.getTime()/1000,
        valRight: this.props.default.right.getTime()/1000
        
    }

    componentDidMount() {

        console.log("[DateRangeSlider] updated")
        console.log(this.props.minDate)
        console.log(this.props.maxDate)
      

    }

    componentDidUpdate() {

        //console.log("[SearchInput] updated")
      

    }

    sliderChangeHandler = (event, newValue) => {

        console.log(newValue);

        this.setState({
            valLeft: newValue[0],
            valRight: newValue[1]
        });

        this.props.change(new Date(newValue[0]*1000), new Date(newValue[1]*1000));

    }

    iOSBoxShadow = '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';

    IOSSlider = withStyles({
        root: {
          color: '#000',
          height: 2,
          padding: '15px 0',
        },
        thumb: {
          height: 28,
          width: 28,
          backgroundColor: '#fff',
          boxShadow: this.iOSBoxShadow,
          marginTop: -14,
          marginLeft: -14,
          '&:focus, &:hover, &$active': {
            boxShadow: '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)',
            // Reset on touch devices, it doesn't add specificity
            '@media (hover: none)': {
              boxShadow: this.iOSBoxShadow,
            },
          },
        },
        active: {},
        circle:{
            width: "50px !important"    

        },
        valueLabel: {
          width: "50px !important",
          left: 'calc(-50% + 11px)',
          top: -22,
          fontSize: '10px',
          '& *': {
            background: 'transparent',
            color: '#000',
          },
        },
        track: {
          height: 2,
        },
        rail: {
          height: 2,
          opacity: 0.5,
          backgroundColor: '#bfbfbf',
        },
        mark: {
          backgroundColor: '#bfbfbf',
          height: 8,
          width: 1,
          marginTop: -3,
        },
        markActive: {
          opacity: 1,
          backgroundColor: 'currentColor',
        },
      })(Slider);

      labelFormatter = seconds => {

        let date = new Date(seconds*1000)
        //console.log(date.toDateString())
        return date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()

      }

    
    render() {

        let IOSSlider = this.IOSSlider; 

        return (

            <IOSSlider 
                value={[this.state.valLeft, this.state.valRight]}
                min={this.props.minDate.getTime()/1000}
                max={this.props.maxDate.getTime()/1000}
                step={this.props.step}
                onChange={this.sliderChangeHandler}
                valueLabelDisplay="on"
                valueLabelFormat={seconds => this.labelFormatter(seconds) }
                aria-labelledby="range-slider"
            />
            
        );

    }
}

export default DateRangeSlider;