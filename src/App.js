import React, { Component } from "react";
import { csv as d3Csv } from "d3-request";

import logo from "./logo.svg";
import "./App.css";

import Piechart from "./Piechart";

class App extends Component {
    state = {
        data: []
    };
    componentDidMount() {
        d3Csv(
            "transport.csv",
            d => ({
                ...d,
                amount: Number(d["In main currency"].replace(",", ""))
            }),
            (error, data) => {
                if (error) {
                    console.error(error);
                }

                this.setState({
                    data
                });
            }
        );
    }

    render() {
        const { data } = this.state;

        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">
                        A pie chart with transitions and sane click events
                    </h1>
                </header>
                <p className="App-intro">
                    <svg width="800" height="600">
                        <Piechart
                            data={data}
                            groupBy={d => d.Tags.split(", ").sort()}
                            x={400}
                            y={300}
                        />
                    </svg>
                </p>
            </div>
        );
    }
}

export default App;
