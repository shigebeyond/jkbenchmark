import React, { Component } from 'react';
import { Bar, Doughnut, Line, Pie, Polar, Radar } from 'react-chartjs-2';
import {
  Badge,
  Button,
  ButtonToolbar,
  ButtonGroup,
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


const chartOptions = {
  tooltips: {
    enabled: false,
    custom: CustomTooltips
  },
  maintainAspectRatio: false
}

// 过滤的字段名
const filterFields = ['player', 'action', 'concurrents', 'requests', 'async', 'xField'];

// 轴字段值
const axisFieldValues = {
  vsField : filterFields,
  xField : filterFields,
  //yField : ['tps', 'rt', 'err_pct']
}

// y轴字段值
const yFieldValues = ['tps', 'rt', 'err_pct']

/**
 * 性能测试图表
 */
class Benchmark extends Component {
  constructor(){
    super();
    this.state = {
      // 轴字段
      vsField: null, // 对比字段
      xField: null, // x轴字段
      yField: null, // y轴字段

      // 过滤字段
      player: null,
      action: null,
      concurrents: null,
      requests: null,
      async: null,

      // 数据
      fieldValues:{},
      trendValues:null,
    }

    this.queryTrendValues = this.queryTrendValues.bind(this)
    this.renderYFieldButton = this.renderYFieldButton.bind(this)
    this.buildLineData = this.buildLineData.bind(this)
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
    let app = this.getQuery('app')
    if(app == null){
      alert("缺少参数: app");
      return
    }

    let query = 'app='+app
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
    console.log(this.state)

    // 收集参数
    // app
    let app = this.getQuery('app')
    // 轴字段
    let {vsField, xField} = this.state
    if(vsField == null){
      alert("请先指定选项: vsField");
      return
    }
    if(xField == null){
      alert("请先指定选项: xField");
      return
    }
    let params = {app, vsField, xField}

    // 过滤字段
    let fields = filterFields.filter(field => field != this.state.vsField && field != this.state.xField) // 过滤字段不包含比较字段+x轴字段
    for(let field of fields){
      let value = this.state[field]
      if(value == null){
        alert("请先指定选项: " + field);
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

  // 渲染轴字段的下拉框
  renderAxisFieldSelects(){
    return Object.entries(axisFieldValues).map(entry => this.renderSelect(entry[0], entry[1]))
  }

  // 渲染过滤字段的下拉框
  renderFilterFieldSelects(key, values){
    //console.log(this.state)
    return Object.entries(this.state.fieldValues)
              .filter(entry => entry[0] != this.state.vsField && entry[0] != this.state.xField) // 过滤字段不包含比较字段+x轴字段
              .map(entry => this.renderSelect(entry[0], entry[1]))
  }

  // 渲染下拉框
  renderSelect(key, values){
    return (
      <FormGroup key={key} className="pr-1">
        <Label className="pr-1">{key}</Label>
        <Input type="select"
            name={key}
            onChange={ e => this.setState({[key]: e.target.value}) }>
          {this.renderOption(null, -1)}
          {values.map(this.renderOption)}
        </Input>
      </FormGroup>
    )
  }

  // 渲染选项
  renderOption(value, i){
    return (<option key={i} value={value}>{value}</option>)
  }

  // 渲染y轴按钮
  renderYFieldButton(v, i){
    return (<Button key={i} color="outline-secondary" onClick={() => this.setState({yField: v})} active={this.state.yField === v}>{v}</Button>)
  }

  // 构建曲线数据
  buildLineData(){
    let {fieldValues, vsField, xField, yField} = this.state
    // 一个对比字段值, 对应一条曲线
    let data = fieldValues[vsField].map(this.buildDataset)
    return {
      labels: fieldValues[xField], // x轴字段的值
      datasets: [
        {
          label: yField + '趋势',
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
          data,
        },
      ],
    }
  }

  // 构建一个对比字段值对应的曲线数据
  buildDataset(vs){
    // trendValues 3维对象: 1 对比字段 2 x轴字段 3 tps/rt/err_pct
    let {trendValues, fieldValues, xField, yField} = this.state

    let data = fieldValues[xField].map(x => // x轴字段的值
      trendValues[vs][x][yField]
    )
    
    return {
      label: `${vs}趋势`,
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
      data,
    }
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Card>
              <CardBody>
                <Row>
                  <Col md="2">
                    <strong>轴字段</strong>
                  </Col>
                  <Col xs="12" md="10">
                    <Form action="" method="" inline>
                      {this.renderAxisFieldSelects()}
                    </Form>
                  </Col>
                </Row>
                <Row>
                  <Col md="2">
                    <strong>过滤字段</strong>
                  </Col>
                  <Col xs="12" md="10">
                    <Form action="" method="" inline>
                      {this.renderFilterFieldSelects()}
                    </Form>
                  </Col>
                </Row>
                <Row>
                  <Col sm="5">
                    <Form action="" method="" inline>
                      <Button type="button" size="sm" color="primary" onClick={this.queryTrendValues}><i className="fa fa-dot-circle-o"></i> Submit</Button>
                    </Form>
                  </Col>
                  <Col sm="7" className="d-none d-sm-inline-block">
                    <ButtonToolbar className="float-right" aria-label="Toolbar with button groups">
                      <ButtonGroup className="mr-3" aria-label="y轴字段">
                        {yFieldValues.map(this.renderYFieldButton)}
                      </ButtonGroup>
                    </ButtonToolbar>
                  </Col>
                </Row>
                <div className="chart-wrapper" style={{ height: 300 + 'px', marginTop: 40 + 'px' }}>
                  {(this.state.trendValues == null) ? null : <Line data={this.buildLineData()} options={chartOptions} height={300}/>}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Benchmark;
