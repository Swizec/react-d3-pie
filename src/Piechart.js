import React, { Component } from "react";
import _ from "lodash";
import * as d3 from "d3";
import styled from "styled-components";

const SArc = styled.path`
    cursor: pointer;
`;

// borrowed from http://bl.ocks.org/mbostock/5100636
function arcTween(oldD, newD, arc) {
    return function(d) {
        var interpolate = d3.interpolate(oldD.endAngle, newD.endAngle);
        return function(t) {
            oldD.endAngle = interpolate(t);
            return arc(oldD);
        };
    };
}

class Arc extends Component {
    arc = d3
        .arc()
        .innerRadius(80)
        .outerRadius(150)
        .cornerRadius(8);

    constructor(props) {
        super(props);

        this.state = {
            color: props.color,
            origCol: props.color,
            d: props.d
        };
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            color: newProps.color
        });

        d3
            .select(this.refs.elem)
            .transition()
            .duration(50)
            .ease(d3.easeCubicInOut)
            .attrTween("d", arcTween(this.state.d, newProps.d, this.arc))
            .on("end", () =>
                this.setState({
                    d: newProps.d
                })
            );
    }

    componentDidUpdate() {
        const { _pathD } = this.state;
    }

    click = () => {
        const { data: { tag, amount } } = this.props.d;
    };

    hover = () => {
        this.setState({
            color: this.state.color.saturate(2)
        });
    };

    unhover = () => {
        this.setState({
            color: this.state.origCol
        });
    };

    render() {
        const { color, pathD } = this.state;

        return (
            <path
                d={pathD}
                style={{
                    fill: color
                }}
                onClick={this.click}
                onMouseOver={this.hover}
                onMouseOut={this.unhover}
                ref="elem"
            />
        );
    }
}

class Piechart extends Component {
    pie = d3
        .pie()
        .value(d => d.amount)
        .sortValues(d => d.tag)
        .padAngle(0.005);

    render() {
        const { data, groupBy, x, y, color } = this.props;

        const _data = Object.entries(_.groupBy(data, groupBy)).map(
            ([tag, values]) => ({
                tag,
                amount: values.map(d => d.amount).reduce((m, n) => m + n, 0)
            })
        );

        return (
            <g transform={`translate(${x}, ${y})`}>
                {this.pie(_data).map((d, i) => (
                    <g key={d.data.tag}>
                        <Arc d={d} color={color(d)} />
                    </g>
                ))}
            </g>
        );
    }
}

export default Piechart;
