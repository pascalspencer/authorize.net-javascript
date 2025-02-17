'use strict';

// Import necessary modules from the 'authorizenet' library
const ApiContracts = require('authorizenet').APIContracts;
const ApiControllers = require('authorizenet').APIControllers;
const SDKConstants = require('authorizenet').Constants;
const utils = require('../utils.js');

// Function to charge a credit card
function chargeCreditCard(callback) {
    // Create a MerchantAuthenticationType object with API login key and transaction key
    const merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
    merchantAuthenticationType.setName('bizdev05');
    merchantAuthenticationType.setTransactionKey('4kJd237rZu59qAZd');

    // Create a CreditCardType object with credit card details
    const creditCard = new ApiContracts.CreditCardType();
    creditCard.setCardNumber('4242424242424242');
    creditCard.setExpirationDate('0822');
    creditCard.setCardCode('999');

    // Create a PaymentType object and set the credit card
    const paymentType = new ApiContracts.PaymentType();
    paymentType.setCreditCard(creditCard);

    // Create an OrderType object with order details
    const orderDetails = new ApiContracts.OrderType();
    orderDetails.setInvoiceNumber('INV-12345');
    orderDetails.setDescription('Product Description');

    // Create ExtendedAmountType objects for tax, duty, and shipping
    const tax = new ApiContracts.ExtendedAmountType();
    tax.setAmount('4.26');
    tax.setName('level2 tax name');
    tax.setDescription('level2 tax');

    const duty = new ApiContracts.ExtendedAmountType();
    duty.setAmount('8.55');
    duty.setName('duty name');
    duty.setDescription('duty description');

    const shipping = new ApiContracts.ExtendedAmountType();
    shipping.setAmount('8.55');
    shipping.setName('shipping name');
    shipping.setDescription('shipping description');

    // Create CustomerAddressType objects for billing and shipping
    const billTo = new ApiContracts.CustomerAddressType();
    billTo.setFirstName('Ellen');
    billTo.setLastName('Johnson');
    billTo.setCompany('Souveniropolis');
    billTo.setAddress('14 Main Street');
    billTo.setCity('Pecan Springs');
    billTo.setState('TX');
    billTo.setZip('44628');
    billTo.setCountry('USA');

    const shipTo = new ApiContracts.CustomerAddressType();
    shipTo.setFirstName('China');
    shipTo.setLastName('Bayles');
    shipTo.setCompany('Thyme for Tea');
    shipTo.setAddress('12 Main Street');
    shipTo.setCity('Pecan Springs');
    shipTo.setState('TX');
    shipTo.setZip('44628');
    shipTo.setCountry('USA');

    // Create LineItemType objects for line items in the order
    const lineItem_id1 = new ApiContracts.LineItemType();
    lineItem_id1.setItemId('1');
    lineItem_id1.setName('vase');
    lineItem_id1.setDescription('cannes logo');
    lineItem_id1.setQuantity('18');
    lineItem_id1.setUnitPrice(45.00);

    const lineItem_id2 = new ApiContracts.LineItemType();
    lineItem_id2.setItemId('2');
    lineItem_id2.setName('vase2');
    lineItem_id2.setDescription('cannes logo2');
    lineItem_id2.setQuantity('28');
    lineItem_id2.setUnitPrice('25.00');

    // Create an ArrayOfLineItem object and add line items to it
    const lineItemList = [lineItem_id1, lineItem_id2];
    const lineItems = new ApiContracts.ArrayOfLineItem();
    lineItems.setLineItem(lineItemList);

    // Create UserField objects for additional user fields
    const userField_a = new ApiContracts.UserField();
    userField_a.setName('A');
    userField_a.setValue('Aval');

    const userField_b = new ApiContracts.UserField();
    userField_b.setName('B');
    userField_b.setValue('Bval');

    // Create an array of UserField objects and set user fields
    const userFieldList = [userField_a, userField_b];
    const userFields = new ApiContracts.TransactionRequestType.UserFields();
    userFields.setUserField(userFieldList);

    // Create SettingType objects for transaction settings
    const transactionSetting1 = new ApiContracts.SettingType();
    transactionSetting1.setSettingName('duplicateWindow');
    transactionSetting1.setSettingValue('120');

    const transactionSetting2 = new ApiContracts.SettingType();
    transactionSetting2.setSettingName('recurringBilling');
    transactionSetting2.setSettingValue('false');

    // Create an array of SettingType objects and set transaction settings
    const transactionSettingList = [transactionSetting1, transactionSetting2];
    const transactionSettings = new ApiContracts.ArrayOfSetting();
    transactionSettings.setSetting(transactionSettingList);

    // Create a TransactionRequestType object with transaction details
    const transactionRequestType = new ApiContracts.TransactionRequestType();
    transactionRequestType.setTransactionType(ApiContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION);
    transactionRequestType.setPayment(paymentType);
    transactionRequestType.setAmount(utils.getRandomAmount());
    transactionRequestType.setLineItems(lineItems);
    transactionRequestType.setUserFields(userFields);
    transactionRequestType.setOrder(orderDetails);
    transactionRequestType.setTax(tax);
    transactionRequestType.setDuty(duty);
    transactionRequestType.setShipping(shipping);
    transactionRequestType.setBillTo(billTo);
    transactionRequestType.setShipTo(shipTo);
    transactionRequestType.setTransactionSettings(transactionSettings);

    // Create a CreateTransactionRequest object and set authentication and transaction details
    const createRequest = new ApiContracts.CreateTransactionRequest();
    createRequest.setMerchantAuthentication(merchantAuthenticationType);
    createRequest.setTransactionRequest(transactionRequestType);

    // Pretty print the request JSON
    console.log(JSON.stringify(createRequest.getJSON(), null, 2));

    // Create a CreateTransactionController object with the request JSON
    const ctrl = new ApiControllers.CreateTransactionController(createRequest.getJSON());
    // Defaults to sandbox, set to production environment
    ctrl.setEnvironment(SDKConstants.endpoint.production);

    // Execute the transaction request
    ctrl.execute(function () {
        // Get the API response
        const apiResponse = ctrl.getResponse();

        // Create a CreateTransactionResponse object with the API response
        const response = new ApiContracts.CreateTransactionResponse(apiResponse);

        // Pretty print the response JSON
        console.log(JSON.stringify(response, null, 2));

        // Process the response
        if (response != null) {
            if (response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK) {
                if (response.getTransactionResponse().getMessages() != null) {
                    console.log('Successfully created transaction with Transaction ID: ' + response.getTransactionResponse().getTransId());
                    console.log('Response Code: ' + response.getTransactionResponse().getResponseCode());
                    console.log('Message Code: ' + response.getTransactionResponse().getMessages().getMessage()[0].getCode());
                    console.log('Description: ' + response.getTransactionResponse().getMessages().getMessage()[0].getDescription());
                } else {
                    console.log('Failed Transaction.');
                    if (response.getTransactionResponse().getErrors() != null) {
                        console.log('Error Code: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorCode());
                        console.log('Error message: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorText());
                    }
                }
            } else {
                console.log('Failed Transaction. ');
                if (response.getTransactionResponse() != null && response.getTransactionResponse().getErrors() != null) {
                    console.log('Error Code: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorCode());
                    console.log('Error message: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorText());
                } else {
                    console.log('Error Code: ' + response.getMessages().getMessage()[0].getCode());
                    console.log('Error message: ' + response.getMessages().getMessage()[0].getText());
                }
            }
        } else {
            console.log('Null Response.');
        }

        // Callback with the response
        callback(response);
    });
}

// If the script is run directly, invoke the chargeCreditCard function
if (require.main === module) {
    chargeCreditCard(function () {
        console.log('chargeCreditCard call complete.');
    });
}

// Export the chargeCreditCard function for external use
module.exports.chargeCreditCard = chargeCreditCard;
