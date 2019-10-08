import React from 'react'
import Loading from 'components/Loading/Loading';

const t = window.Trello;

class Trello extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: null,
      loading: true,
    }
  }

  componentDidMount() {

    if (!this.props.fetch) {
      this.setState({data: null, loading: false})
      return
    }

    this.props
      .fetch(t)
      .then(data => {
        this.setState({data, loading: false})
      })

  }

  render() {
    const {data, loading} = this.state;
    const {children} = this.props;

    return <div>
      {loading && <Loading/>}
      {!loading && children(t, data)}
    </div>
  }

}

export default Trello;
