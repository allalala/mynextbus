import React, { Component } from 'react';

class App extends Component {

  constructor() {
    super()
    this.state = {
      data: [],
      dataLoaded: false,
      busPositions: []
    }
  }

  componentDidMount() {

    const url = "https://api.wmata.com/NextBusService.svc/json/jPredictions?StopID=1001878"
    const opts = {
      method: "GET",
      headers: {
        api_key: '1e44298a93a74eae8488a86395a7adeb'
      }
    }

    fetch(url, opts)
      .then(d => d.json())
      .then(d => {this.setState({
          data: d,
          dataLoaded: true
        })
        console.log(process)
        let routes = [...new Set(d.Predictions.map(item => item.RouteID))];
        routes.map((data, i) => {
          let busUrl = `https://api.wmata.com/Bus.svc/json/jBusPositions?RouteID=${data}`
          return fetch(busUrl, opts)
            .then(data => data.json())
            .then(data => {
              let positions = data.BusPositions;
              positions.map(p => {
                if (p.DirectionNum === 1) {
                  console.log(p)
                  this.setState({
                    busPositions: this.state.busPositions.concat(p)
                  })
                }
                return true
              })
            })
        })
      })
}

  render() {
    const predictions = this.state.data.Predictions;
    if (!predictions) return (<p>Loading...</p>)

    const busPositions = this.state.busPositions;

    return (
      <div id="mainDiv">
        <ul>
        {predictions.map((d, i) => (
          <li key={i}>{d.RouteID} is {d.Minutes} minutes away! (Vehicle ID: {d.VehicleID})</li>
        ))}
        </ul>
        {busPositions && busPositions.map((d, i) => (
          <p>Vehicle {d.VehicleID}, headed for {d.TripHeadsign} left at {d.TripStartTime.split("T")[1]} and is scheduled to arrived at {d.TripEndTime.split("T")[1]}. It's {d.Deviation} behind schedule.</p>
        ))}
    </div>
    );
  }
}

// const center = [38.900312, -76.995442];

export default App;
