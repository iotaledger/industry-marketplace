# SeMarket Industry 4.0 Language Library

## API Description:

#### GET /operations  
1. For CfP message type **returns** list of operations (plain text)

#### GET /submodel/{irdi}
1. Performs lookup in the eCl@ss catalog, retrieves submodel  
2. **Returns** submodel  

#### GET /evaluate/{irdi}/values/{submodel_parameter_values}  
1. Evaluates values  
2. **Returns** success or failure notification
    
#### GET /generate/{message_type}/user/{user_id}/operation/{operation}/values/{submodel_parameter_values}  
1. Generates conversationId, messageId,  
2. Fills placeholder JSON for selected message type with provided values, appends submodel  
3. **Returns** generated message of the selected type (CfP, Proposal, etc.)  

