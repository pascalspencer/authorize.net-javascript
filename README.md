# Credit Card Transaction Processing with Authorize.Net

This project provides Node.js scripts to authorize and charge credit card transactions using the Authorize.Net API.

## Features
- **Authorize a credit card**: Verify card details without charging.
- **Charge a credit card**: Capture payment from a customer.
- **Support for order details**: Includes invoice number, description, tax, duty, shipping, and line items.
- **Customer billing and shipping information**: Send necessary details with transactions.
- **Transaction settings**: Customize settings such as duplicate transaction window and recurring billing.

## Prerequisites
- Node.js installed on your machine.
- An Authorize.Net account with API credentials (API login key and transaction key).
- Required npm packages installed:
  ```sh
  npm install authorizenet
  ```

## Setup
1. Clone the repository and navigate to the project folder.
2. Add your API credentials to `constants.js`:
   ```js
   module.exports = {
       apiLoginKey: 'YOUR_API_LOGIN_KEY',
       transactionKey: 'YOUR_TRANSACTION_KEY'
   };
   ```
3. Ensure `utils.js` contains necessary helper functions.

## Usage

### Authorizing a Credit Card
To run the authorization script:
```sh
node authorize.js
```
This script verifies the card details without charging the card.

### Charging a Credit Card
To charge a credit card:
```sh
node charge.js
```
This script captures payment from a customer's card.

## API Response Handling
Each script logs transaction results to the console, including transaction ID, response code, and error messages if applicable.

## Notes
- The scripts use test card details for sandbox testing.
- Update card details and expiration date before moving to production.
- Ensure environment settings match the intended usage (sandbox or production).

## License
This project is licensed under the MIT License.

