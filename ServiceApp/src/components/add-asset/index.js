import React from 'react';
import styled from 'styled-components';
import get from 'lodash-es/get';
import { evaluate, operations, submodel } from 'industry_4.0_language';
import compareDesc from 'date-fns/compare_desc';
import isFuture from 'date-fns/is_future';
import isValid from 'date-fns/is_valid';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import randomIcon from '../../assets/img/random.svg';
import Loading from '../loading';
import { waitingTime } from '../../config.json';
import UserContext from '../../context/user-context';
import {
  generateRandomSubmodelValues, 
  getRandomTimestamp,
  getRandomLocation
} from '../../utils/randomizer';
import ProximityFeedback from '../ProximityFeedback';

const Card = props => (
  <CardWrapper data-component="AssetCard">
    {
      props.header ? (
        <CardHeader>
          {props.header}
          {
            props.randomize && <Img
              width={30}
              src={randomIcon}
              title="Generate random submodel values"
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
      case 'time':
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
      default:
        return 'text';
  }
}

const initState = {
  loading: false,
  assetStart: new Date(),
  assetEnd: new Date(),
  operation: '',
  description: '',
  operations: [],
  submodel: [],
}

export default class extends React.Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      ...initState
    }

    this.cancel = this.cancel.bind(this);
    this.change = this.change.bind(this);
    this.changeSubmodelValue = this.changeSubmodelValue.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.submit = this.submit.bind(this);
    this.randomize = this.randomize.bind(this);
    this.cleanUp = this.cleanUp.bind(this);
  }

  async componentDidMount() {
    await this.cleanUp();
    const eClassOperations = await operations();
    this.setState({ operations: eClassOperations });
  }

  async componentWillUnmount() {
    await this.cleanUp();
  }

  async cancel() {
    await this.cleanUp();
    this.props.cancel();
  }

  async change({ target: { name, value } }) {
    if (name === 'operation') {
      const eClassSubmodel = await submodel(value);
      const operationObject = value ? this.state.operations.find(({ id }) => id === value) : null;

      this.setState({
        submodel: eClassSubmodel,
        [name]: value,
        description: get(operationObject, 'description') 
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

  async cleanUp() {
    await this.setState({ ...initState });
  }

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
    const { location } = this.context.user;
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
      startTimestamp: typeof assetStart === 'number' ? assetStart : Date.parse(assetStart),
      endTimestamp: typeof assetEnd === 'number' ? assetEnd : Date.parse(assetEnd),
      replyTime: waitingTime,
      location: location || getRandomLocation()
    };

    this.setState({ loading: true });

    const createRequestResult = await this.props.createRequest(messageParameters);

    if (createRequestResult.error) {
      this.setState({ loading: false });
      return alert(createRequestResult.error);
    }
  };

  render() {
    const { loading, operation, operations, submodel, description } = this.state;

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
                  <Form className="form">
                    <Column>
                      <Label>Select Operation:</Label>
                      <Select
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
                      </Select>
                    </Column>
                    { 
                      description && <Row><Description>{description}</Description></Row>
                    }
                    {
                      operation ? (
                        <Row>
                          <Column>
                            <Label>Contract Begin:</Label>
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
                          <div>
                            <Label>Contract End:</Label>
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
                          </div>
                        </Row>
                      ) : null
                    }
                    {
                      submodel.map(({ idShort, valueType }, i) => (
                        <Row key={i}>
                          <Column>
                            <Label>{idShort}:</Label>
                            <Input
                              type={getInputType(valueType)}
                              name="value"
                              value={submodel[i].value}
                              checked={submodel[i].value}
                              onChange={e => this.changeSubmodelValue(e, i)}
                              { ...(valueType !== 'boolean' ? { required: true } : {}) }
                            />
                            <div className="form__error"></div>
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
                    <FooterButton onClick={this.submit} className="form__button">
                      Submit
                    </FooterButton>
                  </FootRow>
                )
              }
            </Card>
          </AddAsset>
        </Modal>
        { operation && <ProximityFeedback /> }
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
  overflow-y: auto;
  max-height: 450px;
`;

const Img = styled.img`
  cursor: pointer;
`;

const Header = styled.span`
  font-size: 24px;
  top: 6px;
  line-height: 42px;
  position: relative;
  color: #4140DF;
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
  padding: 10px 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  text-align: left;
  position: relative;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: baseline;
  @media (max-width: 760px) {
    flex-direction: column;
  }
`;

const FooterButton = styled.button`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  outline: none;
  font: 16px 'Nunito Sans', sans-serif;
  letter-spacing: 0.15px;
  line-height: 17px;
  padding: 12px 20px 10px;
  border-radius: 6px;
  color: ${props => (props.secondary ? '#4140DF' : '#ffffff')};
  background-color: ${props => (props.secondary ? '#ffffff' : '#4140DF')};
  border: ${props => (props.secondary ? '2px solid #4140DF' : 'none')};
  font-weight: 800;
  width: 150px;
  height: 48px;
  text-transform: uppercase;
  transition: all 0.3s;

  &:hover {
    color: ${props => (props.secondary ? '#ffffff' : '#4140DF')};
    background-color: ${props => (props.secondary ? '#4140DF' : '#ffffff')};
    border: 2px solid #4140DF;
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
  font-size: 18px;
  color: #313131;

  &[type=checkbox] {
    height: 15px;
    width: 15px;
    transform: scale(1.5);
    margin-top: 10px;
  }
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
  background-color: rgba(246,248,252, 0.85);
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
  background-color: rgba(195,208,228, 1);
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
  width: 460px;
  &:hover {
    box-shadow: 0 23px 50px 0 rgba(25, 54, 80, 0.1);
  }
`;

const CardHeader = styled.header`
  position: relative;
  padding: 0 30px 10px 30px;
  border-bottom: 1px solid #eaecee;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

const CardFooter = styled.footer`
  padding: 20px 30px;
  background-color: rgba(206, 218, 226, 0.2);
  border-top: 1px solid #eaecee;
  cursor: default;
`;

const Description = styled.p`
  font-size: 16px;
  margin: 5px 0 15px;
  color: #808b92;
`;

const Label = styled.label`
  font: 16px 'Nunito Sans', sans-serif;
  font-weight: 600;
  color: #313131;
  text-transform: uppercase;
`;

const Select = styled.select`
  margin-top: 10px;
  font: 16px 'Nunito Sans', sans-serif;
  font-weight: 600;
  color: #313131;
`;
