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

class Benchmark extends Component {
  constructor(){
    super();
    this.state = {
      fieldValues:{},
      trendValues:{},
    }
  }

  query(name = ''){
    let query = qs.parse(this.props.location.search);
    if(name == '')
        return query

    return query[name]
  }

  async componentDidMount(){
    let query = 'app='+this.query('app')
    let res = await fetch('http://localhost:8080/jkbenchmark-web/benchmark/fieldValues?'+query)
    res = await res.json()
    //console.log(res)
    let fieldValues = res.data;
    this.setState({
        fieldValues,
    })
  }
  render() {
    return (
      <div className="animated fadeIn">
        <CardColumns className="cols-2">
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
          <Card>
            <CardHeader>
              <strong>Inline</strong> Form
            </CardHeader>
            <CardBody>
              <Form action="" method="post" inline>
                <FormGroup className="pr-1">
                  <Label htmlFor="exampleInputName2" className="pr-1">Name</Label>
                  <Input type="text" id="exampleInputName2" placeholder="Jane Doe" required />
                </FormGroup>
                <FormGroup className="pr-1">
                  <Label htmlFor="exampleInputEmail2" className="pr-1">Email</Label>
                  <Input type="email" id="exampleInputEmail2" placeholder="jane.doe@example.com" required />
                </FormGroup>
                <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="select">Select</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="select" name="select" id="select">
                        <option value="0">Please select</option>
                        <option value="1">Option #1</option>
                        <option value="2">Option #2</option>
                        <option value="3">Option #3</option>
                      </Input>
                    </Col>
                  </FormGroup>
                <FormGroup row>
                  <FormGroup check inline>
                    <Input className="form-check-input" type="checkbox" id="inline-checkbox1" name="inline-checkbox1" value="option1" />
                    <Label className="form-check-label" check htmlFor="inline-checkbox1">One</Label>
                  </FormGroup>
                  <FormGroup check inline>
                    <Input className="form-check-input" type="checkbox" id="inline-checkbox2" name="inline-checkbox2" value="option2" />
                    <Label className="form-check-label" check htmlFor="inline-checkbox2">Two</Label>
                  </FormGroup>
                  <FormGroup check inline>
                    <Input className="form-check-input" type="checkbox" id="inline-checkbox3" name="inline-checkbox3" value="option3" />
                    <Label className="form-check-label" check htmlFor="inline-checkbox3">Three</Label>
                  </FormGroup>
              </FormGroup>
              </Form>
            </CardBody>
            <CardFooter>
              <Button type="submit" size="sm" color="primary"><i className="fa fa-dot-circle-o"></i> Submit</Button>
              <Button type="reset" size="sm" color="danger"><i className="fa fa-ban"></i> Reset</Button>
            </CardFooter>
          </Card>
        </CardColumns>
      </div>
    );
  }
}

export default Benchmark;
