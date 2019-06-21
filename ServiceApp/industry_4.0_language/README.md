# SeMarket Industry 4.0 Language Library

API Description:

GET /operations/{message_type}
    For CfP message type returns list of operations (plain text)

GET /submodel/{operation}
    Converts operation to IRDI
    Performs lookup in the eCl@ss catalog, retrieves submodel
    Returns submodel 

GET /evaluate/{submodel_parameter_values}
    Evaluates values
    Returns success or failure notification
    
GET /generate/{message_type}/user/{user_id}/operation/{operation}/values/{submodel_parameter_values}
    Converts operation to IRDI
    Converts submodel parameter values to IRDIs
    Generates conversationId, messageId, 
    Fills placeholder JSON for selected message type with provided values, appends submodel
    Returns generated message of the selected type (CfP, Proposal, etc.)
