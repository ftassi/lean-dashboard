import React from 'react'
import {Line} from 'react-chartjs-2'
import {sortByCompletedAt} from "../../trello/repository";

const cardNames = (t, cards) => {
  return Promise
    .all(cards.map(card => t.get(`cards/${card.id}`, {fields: 'name'})))
}

const t = window.Trello;

class TimeToMarket extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      lineChartData: {},
    }
  }

  componentDidMount() {
    cardNames(t, this.props.data)
      .then(cards => {
        console.log(cards.map(card => card.name))
          this.setState({
            lineChartData: {
              labels: cards.map(card => card.name),
              datasets: [
                {
                  label: 'This must be the product Time To Market',
                  fill: false,
                  lineTension: 0.1,
                  backgroundColor: 'rgba(75,192,192,0.4)',
                  borderColor: 'rgba(75,192,192,1)',
                  borderCapStyle: 'butt',
                  borderDash: [],
                  borderDashOffset: 0.0,
                  borderJoinStyle: 'miter',
                  pointBorderColor: 'rgba(75,192,192,1)',
                  pointBackgroundColor: '#fff',
                  pointBorderWidth: 1,
                  pointHoverRadius: 5,
                  pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                  pointHoverBorderColor: 'rgba(220,220,220,1)',
                  pointHoverBorderWidth: 2,
                  pointRadius: 1,
                  pointHitRadius: 10,
                  data: this.props.data.map(card => card.timeToMarket)
                }
              ]
            }
          })
        }
      )
  }

  render() {
    const {lineChartData} = this.state
    return <Line data={lineChartData}/>
  }
}

export default TimeToMarket
