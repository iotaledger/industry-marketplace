import React from 'react';
import styled from 'styled-components';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import { generate, evaluate, operations, submodel } from '../../Industry_4.0_language';
import compareDesc from 'date-fns/compare_desc';
import isFuture from 'date-fns/is_future';
import isValid from 'date-fns/is_valid';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Loading from '../loading';
import { waitingTime } from '../../config.json';
import {
  generateRandomSubmodelValues, 
  getRandomTimestamp,
  getRandomLocation
} from '../../utils/randomizer';

const Card = props => (
  <CardWrapper data-component="AssetCard">
    {
      props.header ? (
        <CardHeader>
          {props.header}
          {
            props.randomize && <img
              width={50}
              src="/static/icons/dice_transparent.png"
              alt="Chosen by fair dice roll. Guaranteed to be random"
              role="button"
              onClick={props.randomize}
            />
          }
        </CardHeader> 
      ) : null
    }
    {props.children}
    {props.footer ? <CardFooter>{props.footer}</CardFooter> : null}
  </CardWrapper>
);

const getInputType = (type) => {
  switch (type) {
      case 'decimal':
      case 'double':
      case 'float':
      case 'int':
      case 'integer':
      case 'long':
      case 'short':
      case 'byte':
      case 'unsignedLong':
      case 'unsignedShort':
      case 'unsignedByte':
      case 'nonNegativeInteger':
      case 'positiveInteger':
      case 'nonPositiveInteger':
      case 'negativeInteger':
      case 'dateTimeStamp':
          return 'number';

      case 'date':
          return 'date';

      case 'dateTime':
          return 'datetime-local';

      case 'boolean':
          return 'checkbox';

      case 'string':
      case 'langString':
      case 'anyURI':
      case 'complexType':
      case 'anyType':
      case 'anySimpleType':
      case 'anyAtomicType':
      case 'time':
      default:
        return 'text';
  }
}

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      assetStart: new Date(),
      assetEnd: new Date(),
      operation: '',
      operations: [],
      submodel: [],
    };

    this.cancel = this.cancel.bind(this);
    this.change = this.change.bind(this);
    this.changeSubmodelValue = this.changeSubmodelValue.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.submit = this.submit.bind(this);
    this.randomize = this.randomize.bind(this);
  }

  async componentDidMount() {
    const eClassOperations = await operations();
    this.setState({ operations: eClassOperations });
  }

  componentWillUnmount() {
    this.setState({
      loading: false,
      assetStart: new Date(),
      assetEnd: new Date(),
      operation: '',
      operations: [],
      submodel: [],
    });
  }

  cancel() {
    this.setState({
      loading: false,
      assetStart: new Date(),
      assetEnd: new Date(),
      operation: '',
      operations: [],
      submodel: [],
    }, () => this.props.cancel());
  }

  async change({ target: { name, value } }) {
    if (name === 'operation') {
      const eClassSubmodel = await submodel(value);
      this.setState({
        submodel: eClassSubmodel,
        [name]: value
      });
    } else {
      this.setState({ [name]: value });
    }
  };

  changeSubmodelValue({ target: { name, type, value, checked = null } }, index) {
    const submodel = this.state.submodel;
    if (value && type === 'number') {
      submodel[index][name] = Number(value);
    } else {
      const val = type === 'checkbox' ? checked : value;
      submodel[index][name] = val;
    }
    this.setState({ submodel });
  };

  handleDateChange(date, component) {
    this.setState({ [component]: date });
  }

  randomize() {
    const submodel = generateRandomSubmodelValues(this.state.submodel);
    const [assetStart, assetEnd] = getRandomTimestamp();
    this.setState({ submodel, assetStart, assetEnd });
  }

  async submit() {
    const { operation, submodel, assetStart, assetEnd } = this.state;
    const startDate = parse(assetStart);
    const endDate = parse(assetEnd);

    if (!this.state.operation)
      return alert('Please specify required operation');
    if (!this.state.assetStart || !startDate || !isValid(startDate) || !isFuture(startDate))
      return alert('Please enter a valid date/time when the request starts');
    if (!this.state.assetEnd || !endDate || !isValid(endDate) || compareDesc(startDate, endDate) !== 1)
      return alert('Please enter a valid date/time when the request ends');


    const submodelValues = {};
    submodel.forEach(({ semanticId, value, valueType }) => {
      if (['date', 'dateTime', 'dateTimeStamp'].includes(valueType)) {
        submodelValues[semanticId] = Date.parse(value);
      } if (valueType === 'boolean') {
        submodelValues[semanticId] = Boolean(value);
      } else {
        submodelValues[semanticId] = value;
      }
    });

    const fieldsEvaluationResult = evaluate(operation, submodelValues);
    if (fieldsEvaluationResult !== 'success') {
      return alert(fieldsEvaluationResult);
    }

    const messageParameters = {
      submodelValues,
      irdi: operation,
      messageType: 'callForProposal',
      userId: this.props.user.id,
      creationDate: format(Date.now(), 'DD MMMM, YYYY H:mm a '),
      startTimestamp: Date.parse(assetStart),
      endTimestamp: Date.parse(assetEnd),
      replyTime: waitingTime,
      location: getRandomLocation()
    };

    this.setState({ loading: true });

    const message = await generate(messageParameters);
    const createRequestResult = await this.props.createRequest(message);

    if (createRequestResult.error) {
      this.setState({ loading: false });
      return alert(createRequestResult.error);
    }
  };

  render() {
    const { loading, operation, operations, submodel } = this.state;

    return (
      <React.Fragment>
        <Modal className="access-modal-wrapper" show={true}>
          <AddAsset className="access-modal">
            <Card 
              header={<Header>New Request</Header>} 
              randomize={operation ? this.randomize : null}
            >
              {
                !loading ? (
                  <Form>
                    <Column>
                      <label>Select Operation:</label>
                      <select
                        type="text"
                        name="operation"
                        value={operation}
                        onChange={this.change}
                      >
                        <option value=""></option>
                        {
                          operations.map(({ id, name }) =>
                            <option key={id} value={id}>{name}</option>
                          )
                        }
                      </select>
                    </Column>
                    {
                      operation ? (
                        <Row>
                          <Column>
                            <label>Start Time:</label>
                            <DatePicker
                              showTimeSelect
                              todayButton="Today"
                              placeholderText="Click to select a date"
                              timeFormat="HH:mm"
                              timeIntervals={15}
                              dateFormat="MMMM d, yyyy h:mm aa"
                              timeCaption="time"
                              minDate={new Date()}
                              selected={this.state.assetStart}
                              onChange={date => this.handleDateChange(date, 'assetStart')}
                            />
                          </Column>
                          <Column>
                            <label>End Time:</label>
                            <DatePicker
                              showTimeSelect
                              todayButton="Today"
                              placeholderText="Click to select a date"
                              timeFormat="HH:mm"
                              timeIntervals={15}
                              dateFormat="MMMM d, yyyy h:mm aa"
                              timeCaption="time"
                              minDate={new Date()}
                              selected={this.state.assetEnd}
                              onChange={date => this.handleDateChange(date, 'assetEnd')}
                            />
                          </Column>
                        </Row>
                      ) : null
                    }
                    {
                      submodel.map(({ idShort, valueType }, i) => (
                        <Row key={i}>
                          <Column>
                            <label>{idShort}:</label>
                            <Input
                              type={getInputType(valueType)}
                              name="value"
                              value={submodel[i].value}
                              checked={submodel[i].value}
                              onChange={e => this.changeSubmodelValue(e, i)}
                            />
                          </Column>
                        </Row>
                      ))
                    }
                  </Form>
                ) : null
              }
              {
                loading ? (
                  <LoadingBox>
                    <Loading color="#e2e2e2" size="130" />
                  </LoadingBox>
                ) : (
                  <FootRow>
                    <FooterButton secondary onClick={this.cancel}>
                      Cancel
                    </FooterButton>
                    <FooterButton onClick={this.submit}>
                      Submit
                    </FooterButton>
                  </FootRow>
                )
              }
            </Card>
          </AddAsset>
        </Modal>
      </React.Fragment>
    );
  }
}

const LoadingBox = styled.div`
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const Form = styled.form`
  transition: all 0.5s ease;
  padding: 20px 30px;
`;

const Header = styled.span`
  font-size: 24px;
  top: 6px;
  line-height: 42px;
  position: relative;
  color: #009fff;
`;

const FootRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 30px;
  background-color: rgba(206, 218, 226, 0.2);
  border-top: 1px solid #eaecee;
  &:not(:last-of-type) {
    margin-bottom: 5px;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  @media (max-width: 760px) {
    flex-direction: column;
  }
`;

const FooterButton = styled.button`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  font: 16px 'Nunito Sans', sans-serif;
  letter-spacing: 0.47px;
  padding: 12px 21px;
  border-radius: 100px;
  color: ${props => (props.secondary ? '#009fff' : '#ffffff')};
  background-color: ${props => (props.secondary ? '#ffffff' : '#009fff')};
  border: ${props => (props.secondary ? '1px solid #009fff' : 'none')};
  font-size: 16px;
  font-weight: normal;
  letter-spacing: 0.38px;
  width: 150px;
  height: 45px;

  &:hover {
    color: ${props => (props.secondary ? '#ffffff' : '#009fff')};
    background-color: ${props => (props.secondary ? '#009fff' : '#ffffff')};
    border: 1px solid #009fff;
  }
`;

const Input = styled.input`
  border: none;
  outline: none;
  width: 100%;
  padding: 3px 10px 3px 0;
  margin: 0px 5px 10px 0;
  border-bottom: 2px solid #eee;
  background: transparent;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  visibility: visible;
  opacity: 1;
  transition: all 0.5s ease;
  background-color: rgba(14, 56, 160, 0.9);
  z-index: 10000;
`;

const AddAsset = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 30px;
  border-radius: 6px;
  background-color: rgba(10, 32, 86, 0.9);
  box-shadow: 0 23px 50px 0 rgba(25, 54, 80, 0.1);
`;

const CardWrapper = styled.div`
  color: inherit;
  text-decoration: none;
  position: relative;
  border: 1px solid #eaecee;
  border-radius: 6px;
  background-color: #fff;
  cursor: default;
  transition: box-shadow 0.19s ease-out;
  width: 400px;
  &:hover {
    box-shadow: 0 23px 50px 0 rgba(25, 54, 80, 0.1);
  }
`;

const CardHeader = styled.header`
  position: relative;
  padding: 8px 30px 6px 30px;
  border-bottom: 1px solid #eaecee;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const CardFooter = styled.footer`
  padding: 20px 30px;
  background-color: rgba(206, 218, 226, 0.2);
  border-top: 1px solid #eaecee;
  cursor: default;
`;
