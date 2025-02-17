'use strict';

// Import required modules from the 'authorizenet' library
var ApiContracts = require('authorizenet').APIContracts;
var ApiControllers = require('authorizenet').APIControllers;

// Import utility functions and constants
var utils = require('../utils.js');
var constants = require('../constants.js');

// Function to authorize a credit card transaction
function authorizeCreditCard(callback) {
    // Create a MerchantAuthenticationType object with API login key and transaction key
    var merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
    merchantAuthenticationType.setName(constants.apiLoginKey);
    merchantAuthenticationType.setTransactionKey(constants.transactionKey);

    // Create a CreditCardType object with credit card details
    var creditCard = new ApiContracts.CreditCardType();
    creditCard.setCardNumber('4242424242424242');
    creditCard.setExpirationDate('0822');
    creditCard.setCardCode('999');

    // Create a PaymentType object and set the credit card
    var paymentType = new ApiContracts.PaymentType();
    paymentType.setCreditCard(creditCard);

    // Create an OrderType object with order details
    var orderDetails = new ApiContracts.OrderType();
    orderDetails.setInvoiceNumber('INV-12345');
    orderDetails.setDescription('Product Description');

    // Create ExtendedAmountType objects for tax, duty, and shipping
    var tax = new ApiContracts.ExtendedAmountType();
    tax.setAmount('4.26');
    tax.setName('level2 tax name');
    tax.setDescription('level2 tax');

    var duty = new ApiContracts.ExtendedAmountType();
    duty.setAmount('8.55');
    duty.setName('duty name');
    duty.setDescription('duty description');

    var shipping = new ApiContracts.ExtendedAmountType();
    shipping.setAmount('8.55');
    shipping.setName('shipping name');
    shipping.setDescription('shipping description');

    // Create CustomerAddressType objects for billing and shipping
    var billTo = new ApiContracts.CustomerAddressType();
    billTo.setFirstName('Ellen');
    billTo.setLastName('Johnson');
    billTo.setCompany('Souveniropolis');
    billTo.setAddress('14 Main Street');
    billTo.setCity('Pecan Springs');
    billTo.setState('TX');
    billTo.setZip('44628');
    billTo.setCountry('USA');

    var shipTo = new ApiContracts.CustomerAddressType();
    shipTo.setFirstName('China');
    shipTo.setLastName('Bayles');
    shipTo.setCompany('Thyme for Tea');
    shipTo.setAddress('12 Main Street');
    shipTo.setCity('Pecan Springs');
    shipTo.setState('TX');
    shipTo.setZip('44628');
    shipTo.setCountry('USA');

    // Create LineItemType objects for line items in the order
    var lineItem_id1 = new ApiContracts.LineItemType();
    lineItem_id1.setItemId('1');
    lineItem_id1.setName('vase');
    lineItem_id1.setDescription('cannes logo');
    lineItem_id1.setQuantity('18');
    lineItem_id1.setUnitPrice(45.00);

    var lineItem_id2 = new ApiContracts.LineItemType();
    lineItem_id2.setItemId('2');
    lineItem_id2.setName('vase2');
    lineItem_id2.setDescription('cannes logo2');
    lineItem_id2.setQuantity('28');
    lineItem_id2.setUnitPrice('25.00');

    // Create an ArrayOfLineItem object and add line items to it
    var lineItemList = [lineItem_id1, lineItem_id2];
    var lineItems = new ApiContracts.ArrayOfLineItem();
    lineItems.setLineItem(lineItemList);

    // Create UserField objects for additional user fields
    var userField_a = new ApiContracts.UserField();
    userField_a.setName('A');
    userField_a.setValue('Aval');

    var userField_b = new ApiContracts.UserField();
    userField_b.setName('B');
    userField_b.setValue('Bval');

    // Create an array of UserField objects and set user fields
    var userFieldList = [userField_a, userField_b];
    var userFields = new ApiContracts.TransactionRequestType.UserFields();
    userFields.setUserField(userFieldList);

    // Create SettingType objects for transaction settings
    var transactionSetting1 = new ApiContracts.SettingType();
    transactionSetting1.setSettingName('duplicateWindow');
    transactionSetting1.setSettingValue('120');

    var transactionSetting2 = new ApiContracts.SettingType();
    transactionSetting2.setSettingName('recurringBilling');
    transactionSetting2.setSettingValue('false');

    // Create an array of SettingType objects and set transaction settings
    var transactionSettingList = [transactionSetting1, transactionSetting2];
    var transactionSettings = new ApiContracts.ArrayOfSetting();
    transactionSettings.setSetting(transactionSettingList);

    // Create a TransactionRequestType object with transaction details
    var transactionRequestType = new ApiContracts.TransactionRequestType();
    transactionRequestType.setTransactionType(ApiContracts.TransactionTypeEnum.AUTHONLYTRANSACTION);
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
    var createRequest = new ApiContracts.CreateTransactionRequest();
    createRequest.setMerchantAuthentication(merchantAuthenticationType);
    createRequest.setTransactionRequest(transactionRequestType);

    // Pretty print the request JSON
    console.log(JSON.stringify(createRequest.getJSON(), null, 2));

    // Create a CreateTransactionController object with the request JSON
    var ctrl = new ApiControllers.CreateTransactionController(createRequest.getJSON());

    // Execute the transaction request
    ctrl.execute(function () {
        // Get the API response
        var apiResponse = ctrl.getResponse();

        // Create a CreateTransactionResponse object with the API response
        var response = new ApiContracts.CreateTransactionResponse(apiResponse);

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
                console.log('Failed Transaction.');
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

// If the script is run directly, invoke the authorizeCreditCard function
if (require.main === module) {
    authorizeCreditCard(function () {
        console.log('authorizeCreditCard call complete.');
    });
}

// Export the authorizeCreditCard function for external use
module.exports.authorizeCreditCard = authorizeCreditCard;
