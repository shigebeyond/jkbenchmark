import React, { Component } from 'react';
import { Card, CardBody, CardColumns, CardHeader } from 'reactstrap';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';

class Dashboard extends Component {
  constructor(){
    super();
    this.state = {
      apps: []
    }

    this.renderApp = this.renderApp.bind(this)
    this.renderPlayer = this.renderPlayer.bind(this)
  }

  async componentDidMount(){
    let res = await fetch('http://localhost:8080/jkbenchmark-web/benchmark/apps')
    res = await res.json()
    //console.log(res)
    let apps = res.data || [];
    this.setState({apps})

    let nav = Object.keys(apps).map(app => {
      // 子菜单
      let children = []
      children.push({
         name: 'allPlayers',
         url: `/benchmark?app=${app}`,
         icon: 'icon-star',
      })
      let players = apps[app]
      players.map(player => {
        children.push({
           name: player,
           url: `/benchmark?app=${app}&player=${player}`,
           icon: 'icon-star',
        })
      })
      return {
           name: app,
           url: '/all',
           icon: 'icon-star',
           children,
         }
    })
    this.setState({
      nav
    })
  }

  renderPlayer(app, player, i){
    return (
      <div key={i} className="chart-wrapper">
         {i+2}. <a href={"#/benchmark?app="+app+"&player="+player} className="card-header-action">{player}</a>
      </div>
      
    )
  }

  renderApp(app, i){
    return (
      <Card key={i}>
        <CardHeader>
          Players for App <strong>{app}</strong>
        </CardHeader>
        <CardBody>
          <div className="chart-wrapper">
            1. <a href={"#/benchmark?app="+app} className="card-header-action">All Players</a>
          </div>
          <div className="chart-wrapper">
            {this.state.apps[app].map((player, i) => this.renderPlayer(app, player, i))}
          </div>
        </CardBody>
      </Card>
    )
  }

  render() {
    return (
      <div className="animated fadeIn">
        <CardColumns className="cols-2">
          {Object.keys(this.state.apps).map(this.renderApp)}
        </CardColumns>
      </div>
    );
  }
}

export default Dashboard;
