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

const colors = [ 'purple', 'red', 'blue', 'aqua', 'yellow', 'black', 'fuchsia', 'gray', 'green', 'lime', 'maroon', 'navy', 'olive', 'silver', 'teal' ]

const chartOptions = {
  tooltips: {
    enabled: false,
    custom: CustomTooltips
  },
  maintainAspectRatio: false
}


// y轴字段值
const yFieldValues = ['tps', 'rt', 'err_pct']

/**
 * 性能测试图表
 */
class Benchmark extends Component {
  constructor(props){
    super(props);

    // 函数绑定
    this.queryTrendValues = this.queryTrendValues.bind(this)
    this.renderYFieldButton = this.renderYFieldButton.bind(this)
    this.buildLineData = this.buildLineData.bind(this)
    this.buildDataset = this.buildDataset.bind(this)

    // 重置
    let app = this.getQuery('app')
    let player = this.getQuery('player') || null
    this.reset(app, player, true)
  }

  // 重置
  reset(app, player, init = false){
    // app
    this.app = app;
    if(this.app == null){
      alert("缺少参数: app");
      return
    }

    // player
    this.player = player;

    // 过滤的字段名
    this.filterFields = ['player', 'action', 'concurrents', 'requests', 'async'];
    if(this.player) // 已指定了player, 则不参与查询
        this.filterFields.splice(0, 1) // 删除

    // 轴字段值
    this.axisFieldValues = {
      vsField : this.filterFields,
      xField : this.filterFields,
      //yField : ['tps', 'rt', 'err_pct']
    }

    // 状态
    let state = {
      // 轴字段
      vsField: null, // 对比字段
      xField: null, // x轴字段
      yField: 'tps', // y轴字段

      // 过滤字段
      player: this.player,
      action: null,
      concurrents: null,
      requests: null,
      async: null,

      // 数据
      fieldValues:{},
      trendParams:null, // 记录当前查询的参数
      trendValues:null,
    }
    if(init) // 构造函数
      this.state = state;
    else // componentWillReceiveProps
      this.setState(state)
  }

  async componentDidMount(){
    this.queryFieldValues()    
  }

  componentWillReceiveProps(newProps) {
    let newApp = this.getQuery('app', newProps.location.search)
    let newPlayer = this.getQuery('player', newProps.location.search) || null

    // app/player变化
    if(newApp != this.app || newPlayer != this.player){
      this.reset(newApp, newPlayer)
      this.queryFieldValues()
    }

  }

  getQuery(name, search = null){
    if(search == null)
      search = this.props.location.search
    
    let query = qs.parse(search);
    if(name == '')
        return query

    return query[name]
  }

  // 查询字段值
  async queryFieldValues(){
    let query = 'app='+this.app
    let res = await fetch('http://localhost:8080/benchmark/fieldValues?'+query)
    res = await res.json()
    //console.log(res)
    let fieldValues = res.data;
    let newState = {fieldValues}
    //只有一个值的字段默认选中
    for (let key in  fieldValues) {
      let values = fieldValues[key]
      if(values.length == 1)
        newState[key] = values[0]
    }
    this.setState(newState)
  }

  // 查询趋势数据
  async queryTrendValues(){
    //console.log(this.state)

    // 收集参数
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
    if(xField == vsField){
      alert("xField 跟 vsField 不能一样");
      return
    }
    let params = {app: this.app, player: this.player, vsField, xField}

    // 过滤字段
    let fields = this.filterFields.filter(field => field != this.state.vsField && field != this.state.xField) // 过滤字段不包含比较字段+x轴字段
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
    let res = await fetch('http://localhost:8080/benchmark/trendValues?'+query)
    res = await res.json()
    //console.log(res)
    let trendValues = res.data;
    this.setState({
        trendParams: params,
        trendValues,
    })
  }

  // 渲染轴字段的下拉框
  renderAxisFieldSelects(){
    return Object.entries(this.axisFieldValues).map(entry => {
      let [key, fields] = entry
      if(key == 'xField'){ // x轴要去掉只有单个值的字段, 否则曲线数据只有一点, 无法成线
        fields = fields.filter(field => {
            let values = this.state.fieldValues[field] || []
            return values.length > 1
        })
      }
      return this.renderSelect(key, fields)
    })
  }

  // 渲染过滤字段的下拉框
  renderFilterFieldSelects(key, values){
    //console.log(this.state)
    /*
    return Object.entries(this.state.fieldValues)
              .filter(entry => entry[0] != this.state.vsField && entry[0] != this.state.xField) // 过滤字段不包含比较字段+x轴字段
              .map(entry => this.renderSelect(entry[0], entry[1]))
    */
    return this.filterFields
              .filter(v => v != this.state.vsField && v != this.state.xField) // 过滤字段不包含比较字段+x轴字段
              .map(v => this.renderSelect(v, this.state.fieldValues[v] || []))
  }

  // 渲染下拉框
  renderSelect(key, values){
    return (
      <FormGroup key={key} className="pr-1" value={this.state[key]}>
        <Label className="pr-1">{key}</Label>
        <Input type="select"
            name={key}
            onChange={ e => this.setState({[key]: e.target.value}) }>
          {this.renderOption(key, null, -1)}
          {values.map((value, i) => this.renderOption(key, value, i))}
        </Input>
      </FormGroup>
    )
  }

  // 渲染选项
  renderOption(key, value, i){
    return (<option key={i} value={value} selected={value == this.state[key]}>{value}</option>)
  }

  // 渲染y轴按钮
  renderYFieldButton(v, i){
    return (<Button key={i} color="outline-secondary" onClick={() => this.setState({yField: v})} active={this.state.yField === v}>{v}</Button>)
  }

  // 构建曲线数据
  buildLineData(){
    let {vsField, xField} = this.state.trendParams
    let {fieldValues, yField} = this.state
    // 一个对比字段值, 对应一条曲线
    let data = fieldValues[vsField].map(this.buildDataset)
    return {
      labels: fieldValues[xField], // x轴字段的值
      datasets: data,
    }
  }

  // 构建一个对比字段值对应的曲线数据
  buildDataset(vs, i){
    // trendValues 3维对象: 1 对比字段 2 x轴字段 3 tps/rt/err_pct
    let {xField} = this.state.trendParams
    let {trendValues, fieldValues, yField} = this.state

    let data = fieldValues[xField].map(x => // x轴字段的值
      trendValues[vs] && trendValues[vs][x] && trendValues[vs][x][yField] || 0
    )
    
    return {
      label: `${vs}趋势`,
      fill: false,
      lineTension: 0.1,
      backgroundColor: colors[i],
      borderColor: colors[i],
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: colors[i],
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: colors[i],
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
                      <Button type="button" size="sm" color="primary" onClick={this.queryTrendValues}><i className="fa fa-dot-circle-o"></i> 查询</Button>
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
