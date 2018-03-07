import React, { Component } from "react";
import _ from "lodash";
import * as d3 from "d3";
import styled from "styled-components";

const SArc = styled.path`
    cursor: pointer;
`;

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
            origCol: props.color
        };
    }

    componentWillReceiveProps(newProps) {
        this.setState({ color: newProps.color });
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
        const { d } = this.props;
        const { color } = this.state;

        return (
            <SArc
                d={this.arc(d)}
                style={{
                    fill: color
                }}
                onClick={this.click}
                onMouseOver={this.hover}
                onMouseOut={this.unhover}
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
