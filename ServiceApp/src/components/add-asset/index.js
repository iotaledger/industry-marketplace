import React from 'react';
import styled from 'styled-components';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import compareDesc from 'date-fns/compare_desc';
import isFuture from 'date-fns/is_future';
import isValid from 'date-fns/is_valid';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Loading from '../loading';

const Heading = category => <Header>New {category.replace(/s([^s]*)$/,'')}</Header>;

const Card = props => (
  <CardWrapper data-component="AssetCard">
    {props.header ? <CardHeader>{props.header}</CardHeader> : null}
    {props.children}
    {props.footer ? <CardFooter>{props.footer}</CardFooter> : null}
  </CardWrapper>
);

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      active: true,
      submit: false,
      city: '',
      country: '',
      company: '',
      assetName: '',
      assetDescription: '',
      assetType: '',
      assetLocation: '',
      assetLat: '',
      assetLon: '',
      assetPrice: '',
      assetStart: new Date(),
      assetEnd: new Date(),
      assetActive: true,
      dataTypes: [{ name: '', value: '' }],
    };

    this.addRow = this.addRow.bind(this);
    this.activate = this.activate.bind(this);
    this.cancel = this.cancel.bind(this);
    this.remove = this.remove.bind(this);
    this.change = this.change.bind(this);
    this.changeRow = this.changeRow.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  addRow() {
    const dataTypes = this.state.dataTypes;
    dataTypes.push({ name: '', value: '' });
    this.setState({ dataTypes });
  };

  activate() {
    this.setState({ active: true });
  }

  cancel() {
    this.setState({ active: false });
    this.props.cancel();
  }

  remove(i) {
    const dataTypes = this.state.dataTypes;
    if (dataTypes.length === 1) return alert('You must have at least one data field.');
    dataTypes.splice(i, 1);
    this.setState({ dataTypes });
  };

  change(e) {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleDateChange(date, component) {
    this.setState({ [component]: date });
  }

  changeRow(e, i) {
    const dataTypes = this.state.dataTypes;
    dataTypes[i][e.target.name] = e.target.value;
    this.setState({ dataTypes });
  };

  async submit() {
    const startDate = parse(this.state.assetStart);
    const endDate = parse(this.state.assetEnd);

    if (!this.state.assetName) return alert('Please enter asset name');
    if (!this.state.assetType)
      return alert('Specify type of asset');
    if (!this.state.city || !this.state.country) return alert('Enter city and country');

    if (this.props.category === 'requests') {
      if (!this.state.assetStart || !startDate || !isValid(startDate) || !isFuture(startDate))
        return alert('Please enter a valid date/time when the offer starts');
      if (!this.state.assetEnd || !endDate || !isValid(endDate) || compareDesc(startDate, endDate) !== 1)
        return alert('Please enter a valid date/time when the offer ends');
    }  

    this.setState({ loading: true });

    const asset = {
      location: {
        city: this.state.city,
        country: this.state.country,
      },
      assetName: this.state.assetName,
      assetDescription: this.state.assetDescription,
      type: this.state.assetType,
      dataTypes: this.state.dataTypes,
      lat: parseFloat(this.state.assetLat),
      lon: parseFloat(this.state.assetLon),
      company: this.state.company,
      price: Number(this.state.assetPrice),
      category: this.props.category,
      creationDate: format(Date.now(), 'DD MMMM, YYYY H:mm a '),
    };

    if (this.props.category === 'requests') {
      asset.start = startDate;
      asset.end = endDate;
    }

    const createAssetResult = await this.props.createAsset(asset);

    if (createAssetResult.error) {
      this.setState({ loading: false });
      return alert(createAssetResult.error);
    }

    this.setState({
      loading: false,
      active: false,
      city: '',
      country: '',
      company: '',
      assetName: '',
      assetDescription: '',
      assetType: '',
      assetLocation: '',
      assetLat: '',
      assetLon: '',
      assetPrice: '',
      assetStart: '',
      assetEnd: '',
      dataTypes: [{ id: '', name: '', unit: '' }],
    });

  };

  render() {
    const { active, loading } = this.state;
    return (
      <React.Fragment>
        {
          active ? (
            <Modal className="access-modal-wrapper" show={true}>
              <AddAsset className="access-modal">
                <Card header={Heading(this.props.category)}>
                  {
                    !loading ? (
                      <Form>
                        <Column>
                          <label>Asset Name:</label>
                          <Input
                            placeholder="unique Asset Name"
                            type="text"
                            name="assetName"
                            value={this.state.assetName}
                            onChange={this.change}
                          />
                        </Column>
                        <Column>
                          <label>Asset Description:</label>
                          <Input
                            placeholder="asset description"
                            type="text"
                            name="assetDescription"
                            value={this.state.assetDescription}
                            onChange={this.change}
                          />
                        </Column>
                        <Column>
                          <label>Asset Type:</label>
                          <select
                            placeholder="eg. network bandwidth"
                            type="text"
                            name="assetType"
                            value={this.state.assetType}
                            onChange={this.change}
                          >
                            <option value=""></option>     
                            <option value="frequency">Frequency</option>
                            <option value="infrastructure">Infrastructure</option>
                            <option value="cell">Cell</option>
                            <option value="connectivity">Connectivity</option>
                          </select>
                        </Column>
                        <Column>
                          <label>
                            {this.props.category === 'offers' ? 'Asset' : 'Service'} Provider:
                          </label>
                          <Input
                            placeholder="eg. Orange"
                            type="text"
                            name="company"
                            value={this.state.company}
                            onChange={this.change}
                          />
                        </Column>
                        <Column>
                          <label>Price / min:</label>
                          <Input
                            placeholder={100}
                            type="number"
                            name="assetPrice"
                            value={this.state.assetPrice}
                            onChange={this.change}
                          />
                        </Column>
                        {
                          this.props.category === 'requests' ? (   
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
                        <Column>
                          <label>Location:</label>
                          <Row>
                            <Input
                              placeholder="eg. Nice"
                              type="text"
                              name="city"
                              value={this.state.city}
                              onChange={this.change}
                            />
                            <Input
                              placeholder="eg. France"
                              type="text"
                              name="country"
                              value={this.state.country}
                              onChange={this.change}
                            />
                          </Row>
                        </Column>
                        <Row>
                          <Column>
                            <label>Latitude:</label>
                            <Input
                              placeholder="eg. 43.701"
                              type="number"
                              name="assetLat"
                              value={this.state.assetLat}
                              onChange={this.change}
                            />
                          </Column>
                          <Column>
                            <label>Longitude:</label>
                            <Input
                              placeholder="eg. 7.264"
                              type="number"
                              name="assetLon"
                              value={this.state.assetLon}
                              onChange={this.change}
                            />
                          </Column>
                        </Row>
                        <Row style={{ justifyContent: 'space-between' }}>
                          <Header>Additional Parameters:</Header>
                          <Add onClick={this.addRow}>
                            <IconButton src="/static/icons/icon-add.svg" />
                          </Add>
                        </Row>
                        {this.state.dataTypes.map((fields, i) => (
                          <Row key={i}>
                            <Small>
                              <label>Field Name:</label>
                              <Input
                                placeholder="eg. Frequency"
                                type="text"
                                name="name"
                                value={this.state.dataTypes[i].name}
                                onChange={e => this.changeRow(e, i)}
                              />
                            </Small>

                            <Small>
                              <label>Field Value:</label>
                              <Input
                                placeholder="eg. Hz"
                                type="text"
                                name="value"
                                value={this.state.dataTypes[i].unit}
                                onChange={e => this.changeRow(e, i)}
                              />
                            </Small>
                            <Add style={{ flex: 1 }} onClick={() => this.remove(i)}>
                              <IconButton src="/static/icons/icon-delete.svg" />
                            </Add>
                          </Row>
                        ))}
                      </Form>
                    ) : null
                  }
                  {
                    loading && (
                      <LoadingBox>
                        <Loading color="#e2e2e2" size="130" />
                      </LoadingBox>
                    )
                  }
                  <FootRow>
                    <FooterButton secondary onClick={this.cancel}>
                      Cancel
                    </FooterButton>
                    <FooterButton onClick={this.submit}>
                      Submit
                    </FooterButton>
                  </FootRow>
                </Card>
              </AddAsset>
            </Modal>
          ) : null
        }
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

const Small = styled(Column)`
  width: 45%;
  @media (max-width: 760px) {
    width: 100%;
  }
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  @media (max-width: 760px) {
    flex-direction: column;
  }
`;

const IconButton = styled.img`
  height: 20px;
  width: 20px;
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

const Add = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  paddin: 10px 0 0;
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
  padding: 0 30px 8px 30px;
  border-bottom: 1px solid #eaecee;
`;

const CardFooter = styled.footer`
  padding: 20px 30px;
  background-color: rgba(206, 218, 226, 0.2);
  border-top: 1px solid #eaecee;
  cursor: default;
`;