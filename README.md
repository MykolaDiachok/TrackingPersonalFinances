# Tpf

# **Expense Tracker Application**

### **Description:**

You need to create a web application for tracking personal finances. The user should be able to add expenses and incomes, view the overall balance, and filter records by categories.

### **Functional Requirements:**

1. **Adding Income and Expenses**
    - -[x] The user can add records for income and expenses through a form:
    - -[x] Name (required)
    - -[x] Amount (required, float, two decimal places)
    - -[x] Transaction type (income or expense)
    - -[x] Category (e.g., "Groceries," "Salary," "Entertainment," etc.)
    - -[x] Transaction date (default to current date but can be changed)
2. **Viewing Total Balance**
    -  -[x]  The application should display the current balance: the total amount of income minus expenses.
3. **Transaction List**
    - -[x] The user can view all transactions in a list format:
        -[x] Transaction name
        -[x] Amount
        -[x] Category
        -[x] Date
4. **Filtering Transactions**
   - -[x] The user can filter transactions by type (income or expense) and by categories.
   - -[x] The ability to sort records by date or amount.
5. **Data Persistence**
   - -[x] All data must be stored in localStorage so that records persist after a page reload.

### **Technical Requirements:**
  - -[x] Angular latest version
  - -[x] Keeping the code clean (use eslint for check)
  - -[x] Readable and understandable names of variables, classes, functions and methods
  - -[x] Use the types `any` and `unknown` as little as possible
  - -[x] Use of third-party libraries is allowed
  - -[x] Everything should to be developed taking into account the fact that in the future it is possible to add other types of questions.
  - -[x] All application state and all data must be stored in local storage. That is, after reloading the page, the state of the application must be restored. All previously created questions and answers must be restored.
  - -[ ] Responsive design for convenient use on mobile devices. (optional)
