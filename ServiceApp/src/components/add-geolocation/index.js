import React from 'react';
import styled from 'styled-components';
import Loading from '../loading';
import locationFormats from './location.formats'

const Card = props => (
  <CardWrapper data-component="AssetCard">
    {props.header ? <CardHeader>{props.header}</CardHeader> : null}
    {props.children}
    {props.footer ? <CardFooter>{props.footer}</CardFooter> : null}
  </CardWrapper>
);

const initState = {
  inputText: '',
  loading: false,
  selectedIndex: 0
}

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...initState
    }

    this.cancel = this.cancel.bind(this);
    this.change = this.change.bind(this);
    this.submit = this.submit.bind(this);
  }

  componentWillUnmount() {
    this.setState({ ...initState });
  }

  cancel() {
    this.setState({
      loading: false
    }, () => this.props.handleLocationModal(false));
  }

   change({ target: { value, name } }) {
     if(name === 'inputText') {
       this.setState({ inputText: value });
     } else if (name === 'operation') {
       const index = value
       this.setState({ selectedIndex : index });
     }
  }

  async submit() {
    // actions are defined in ./location.formats.js
    const sendMessagetResult = await locationFormats[this.state.selectedIndex].action(
      this.props.sendMessage,
      this.state.inputText
    );

    if (sendMessagetResult.error) {
      return alert(sendMessagetResult.error);
    }
  }

  render() {
    const { loading, operation } = this.state;

    return (
      <React.Fragment>
        <Modal className="access-modal-wrapper" show={true}>
          <AddAsset className="access-modal">
            <Card header={<Header>Request Location Format</Header>}>
              {!loading && (
                  <Form>
                    <Column>
                      <label>Select Location format:</label>
                      <Select
                        type="text"
                        name="operation"
                        value={operation}
                        onChange={this.change}
                      >
                        <option value=""></option>
                        {
                          locationFormats.map(({ name }, index) =>
                            <option key={index} value={index}>{name}</option>
                          )
                        }
                      </Select>
                    </Column>
                    <InputWrapper>
                      <Input
                        type="text"
                        onChange={this.change}
                        name="inputText"
                        value={this.state.inputText}
                       />
                    </InputWrapper>
                  </Form>
                )}
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

const Input = styled.input`
  border: none;
  outline: none;
  width: 100%;
  padding: 3px 10px 3px 0;
  margin: 0px 5px 10px 0;
  border-bottom: 2px solid #eee;
  background: transparent;
`;

const InputWrapper = styled.div`
`

const Select = styled.select`
  margin-bottom: 10px;
`

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
