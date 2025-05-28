This document provides a descriptive overview of the FinWise API, detailing its functionality and parameters.

### Authentication

Manage user authentication and accounts.

* **Sign-Up**

    * **POST** `/auth/sign-up`
    * Registers a new user.
    * **Parameters**: `nin`, `email`
    * **Returns**: A JWT for email verification and setting a password.

* **Resend Email Verification**

    * **POST** `/auth/send-email-verification`
    * Resends a verification code to the user's email.

* **Verify Email**

    * **POST** `/auth/verify-email`
    * Verifies a user's email address.
    * **Parameters**: `code`

* **Set Password**

    * **POST** `/auth/set-password`
    * Sets a password for a user with a verified email.
    * **Parameters**: `password`

* **Login**

    * **POST** `/auth/login`
    * Authenticates a user.
    * **Parameters**: `email`, `password`
    * **Returns**: A JWT access token and user details.

***

### Dashboard

Access user dashboard data.

* **Get Dashboard Data**
    * **GET** `/dashboard`
    * Retrieves aggregated data for the authenticated user's dashboard.
    * **Returns**: User information, wallet balance, token portfolio, and market trends.

***

### Deposit

Handle fiat deposit operations.

* **Initialize Deposit**

    * **POST** `/deposit/initialize`
    * Initiates a deposit transaction.
    * **Parameters**: `amount`
    * **Returns**: A Paystack authorization URL and a reference for the transaction.

* **Verify Deposit**

    * **GET** `/deposit/verify/{reference}`
    * Verifies the status of a deposit transaction.
    * **Parameters**: `reference`

***

### Transactions

View user transaction history.

* **Get Wallet Transactions**
    * **GET** `/transactions`
    * Retrieves a list of all transactions for the authenticated user.

***

### Transfer

Facilitate wallet-to-wallet transfers.

* **Create Transfer**
    * **POST** `/transfer`
    * Transfers funds from the authenticated user's wallet to another user's wallet.
    * **Parameters**: `recipientEmail`, `amount`, `currency`

***

### Withdrawal

Manage fiat withdrawal operations.

* **Bank List Retrieval**

    * **GET** `/withdrawal/banks`
    * Retrieves a list of banks supported by Paystack for withdrawals.
    * **Authentication**: Required
    * **Response**:
      ```json
      {
        "status": true,
        "message": "Banks retrieved successfully",
        "data": [
          {
            "id": 1,
            "name": "Access Bank",
            "code": "044",
            "active": true
          },
          ...
        ]
      }
      ```

* **Bank Account Verification**

    * **POST** `/withdrawal/resolve-account`
    * Verifies bank account details with Paystack to confirm account ownership.
    * **Authentication**: Required
    * **Request Body**:
      ```json
      {
        "account_number": "1234567890",
        "bank_code": "044"
      }
      ```
    * **Response**:
      ```json
      {
        "status": true,
        "message": "Account verified successfully",
        "data": {
          "account_name": "JOHN DOE",
          "account_number": "1234567890",
          "bank_code": "044"
        }
      }
      ```

* **Withdrawal Request**

    * **POST** `/withdrawal/request`
    * Initiates a withdrawal from the user's wallet to their bank account.
    * **Authentication**: Required
    * **Request Body**:
      ```json
      {
        "amount": 10000,
        "currency": "NGN",
        "bank_name": "Access Bank",
        "account_number": "1234567890",
        "account_name": "JOHN DOE" 
      }
      ```
    * **Response**:
      ```json
      {
        "status": true,
        "message": "Withdrawal request submitted successfully",
        "data": {
          "id": "w123456",
          "status": "PENDING_REVIEW",
          "amount": 10000,
          "currency": "NGN",
          "created_at": "2025-05-28T08:10:20.000Z"
        }
      }
      ```

**Implementation Details**
- **API Integration**: All withdrawal endpoints integrate with Paystack for bank verification and transaction processing
- **Data Validation**: Request validation using express-validator ensures all required fields are properly formatted
- **Error Handling**: Comprehensive error handling with appropriate status codes and messages
- **Authentication**: All withdrawal endpoints are protected with JWT authentication
- **Mock Mode**: Support for mock responses when MOCK_PAYSTACK=true for development and testing

The routes are properly connected to the main application in index.ts through:
```javascript
app.use('/api/withdrawal', withdrawalRoutes);
```

***

### University Tokens

Handle Nigerian University Token Trading operations.

* **Get All Tokens**

    * **GET** `/token/all`
    * Retrieves a list of all available university tokens and their current prices.

* **Get Market Data**

    * **GET** `/token/market/prices`
    * Retrieves market data for university tokens.

* **Buy Tokens**

    * **POST** `/token/buy`
    * Purchases university tokens using the naira balance in the user's wallet.
    * **Parameters**: `tokenId`, `quantity`, `price`

* **Sell Tokens**

    * **POST** `/token/sell`
    * Sells university tokens for naira, with a 10% fee on profits.
    * **Parameters**: `tokenId`, `quantity`, `price`

* **Get Token Portfolio**

    * **GET** `/token/portfolio`
    * Retrieves the user's token holdings, balances, and profit/loss information.

* **Get Token Transactions**
    * **GET** `/token/transactions`
    * Retrieves the user's token transaction history.