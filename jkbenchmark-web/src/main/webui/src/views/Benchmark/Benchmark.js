import React, { Component } from 'react';
import { Bar, Doughnut, Line, Pie, Polar, Radar } from 'react-chartjs-2';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardColumns,
  Col,
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Fade,
  Form,
  FormGroup,
  FormText,
  FormFeedback,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupButtonDropdown,
  InputGroupText,
  Label,
  Row,
} from 'reactstrap';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import qs from 'query-string';

const line = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'My First dataset',
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
      data: [65, 59, 80, 81, 56, 55, 40],
    },
  ],
};

const options = {
  tooltips: {
    enabled: false,
    custom: CustomTooltips
  },
  maintainAspectRatio: false
}

const fieldNames = {
  app: "应用",
  player: "玩家",
  action: "动作",
  concurrents: "并发数",
  requests: "请求数",
  async: "异步",
  xField: 'x轴字段'
}

class Benchmark extends Component {
  constructor(){
    super();
    this.state = {
      // 轴字段
      vsField: null, // 对比字段
      xField: null, // x轴字段

      // 查询条件
      player: null,
      action: null,
      concurrents: null,
      requests: null,
      async: null,

      // 数据
      fieldValues:{},
      trendValues:{},
    }

    this.queryTrendValues = this.queryTrendValues.bind(this)
  }


  async componentDidMount(){
    this.queryFieldValues()    
  }

  getQuery(name = ''){
    let query = qs.parse(this.props.location.search);
    if(name == '')
        return query

    return query[name]
  }

  // 查询字段值
  async queryFieldValues(){
    let query = 'app='+this.getQuery('app')
    let res = await fetch('http://localhost:8080/jkbenchmark-web/benchmark/fieldValues?'+query)
    res = await res.json()
    //console.log(res)
    let fieldValues = res.data;
    this.setState({
        fieldValues,
    })
  }

  // 查询趋势数据
  async queryTrendValues(){
    // 收集参数
    let params = {app : this.getQuery('app')}
    for(let field of ['player', 'action', 'concurrents', 'requests', 'async']){
      let value = this.state[field]
      if(value == null){
        alert("请先指定选项: " + fieldNames[field]);
        return
      }
      params[field] = value;
    }
    let query = qs.stringify(params)
    // 请求趋势数据
    let res = await fetch('http://localhost:8080/jkbenchmark-web/benchmark/trendValues?'+query)
    res = await res.json()
    //console.log(res)
    let trendValues = res.data;
    this.setState({
        trendValues,
    })
  }

  // 渲染字段的下拉框
  renderFieldSelect(key, values){
    let {fieldValues} = this.state;
    // 添加 x轴字段
    fieldValues['xField'] = ['tps', 'rt', 'err_pct']
    //console.log(fieldValues)
    console.log(this.state)
    return Object.entries(fieldValues).map(entry => this.renderSelect(entry[0], entry[1]))
  }

  // 渲染下拉框
  renderSelect(key, values){
    return values.map(value => {
        return (
          <FormGroup key={key}>
            <Label>{fieldNames[key]}</Label>
            <Input type="select"
                name={key}
                onChange={ e => this.setState({[key]: e.target.value}) }>
              <option value={value}>{value}</option>
            </Input>
          </FormGroup>
        )
    })
  }

  render() {
    return (
      <div className="animated fadeIn">
      {this.renderFieldSelect()}
        <CardColumns className="cols-2">
          <Card>
            <CardHeader>
              查询条件
            </CardHeader>
            <CardBody>
              <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                {this.renderFieldSelect()}
              </Form>
            </CardBody>
            <CardFooter>
              <Button type="button" size="sm" color="primary" onClick={this.queryTrendValues}><i className="fa fa-dot-circle-o"></i> Submit</Button>
              <Button type="reset" size="sm" color="danger"><i className="fa fa-ban"></i> Reset</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              Line Chart
              <div className="card-header-actions">
                <a href="http://www.chartjs.org" className="card-header-action">
                  <small className="text-muted">docs</small>
                </a>
              </div>
            </CardHeader>
            <CardBody>
              <div className="chart-wrapper">
                <Line data={line} options={options} />
              </div>
            </CardBody>
          </Card>
        </CardColumns>
      </div>
    );
  }
}

export default Benchmark;
