bui# Web-Based Expense Tracker System Using PHP and Node.js

**Version:** 1.0  
**Last Updated:** January 4, 2026  
**Project Type:** University SWE Coursework

---

## 1. Introduction
The Web-Based Expense Tracker System is a comprehensive application that helps users record and manage their daily expenses. The system allows users to register, authenticate, add/edit/delete expenses, categorize spending, filter records, export data, and track their budget. This project is designed for university-level Software Engineering (SWE) coursework with focus on practical implementation and best practices.

---

## 2. Technologies Used
- **Frontend:** HTML, CSS, JavaScript
- **Backend:**
  - PHP (handles expense management, categories, filters, exports)
  - Node.js with Express (handles user authentication via REST API)
- **Database:** MySQL
- **Server:** XAMPP (for PHP & MySQL) and Node.js runtime
- **Additional Libraries:**
  - bcrypt (password hashing)
  - express-session (session management)

---

## 3. System Pages and Their Functions

---

### 3.1 Sign Up Page (User Registration)

**Purpose:**  
Allows new users to create an account.

**Form Fields:**
- Name (required, min 3 characters)
- Email (required, valid email format, unique)
- Password (required, min 8 characters)
- Confirm Password (required, must match password)

**Functions:**
- Client-side and server-side input validation
- Email uniqueness check
- Password strength validation
- Secure password hashing using bcrypt
- CSRF token validation

**Working Process:**
1. User enters registration details
2. Client-side JavaScript validates input format
3. Form data is sent to Node.js API endpoint: `POST /api/auth/signup`
4. Server validates data and checks for duplicate email
5. Password is hashed using bcrypt (10 rounds)
6. User data is saved in `users` table
7. Success message is displayed
8. User is redirected to Sign In page

**Error Handling:**
- Email already exists → "This email is already registered"
- Passwords don't match → "Passwords do not match"
- Invalid email format → "Please enter a valid email"
- Weak password → "Password must be at least 8 characters"
- Database error → "Registration failed. Please try again"

---

### 3.2 Sign In Page (User Login)

**Purpose:**  
Allows registered users to log into the system.

**Form Fields:**
- Email (required)
- Password (required)
- Remember Me (optional checkbox)

**Functions:**
- Authenticates user credentials
- Creates secure session
- Optional persistent login (Remember Me)

**Working Process:**
1. User enters login credentials
2. Data is sent to Node.js API: `POST /api/auth/login`
3. Server retrieves user by email
4. Password is verified using bcrypt.compare()
5. If valid, session is created with user_id and email
6. Session token/cookie is sent to client
7. User is redirected to Dashboard
8. If invalid, error message is shown with 3-second delay (prevent brute force)

**Error Handling:**
- Invalid credentials → "Invalid email or password"
- Account locked (after 5 failed attempts) → "Account temporarily locked. Try again in 15 minutes"
- Database error → "Login failed. Please try again"
- Session creation error → "Unable to create session"

---

### 3.3 Dashboard (Home Page)

**Purpose:**  
Main interface after successful login showing expense overview.

**Displays:**
- Welcome message with user's name
- Quick stats: Total Expenses, This Month, This Week
- Recent 5 expenses
- Quick "Add Expense" button
- Category-wise spending summary
- Budget status indicator (if budget is set)

**Functions:**
- Displays user-specific expense summary
- Shows budget alerts if spending exceeds limit
- Provides quick navigation to all features

**Working Process:**
- PHP retrieves user's expenses from database
- Calculates totals for different time periods
- Groups expenses by category
- Displays data in cards and tables
- Shows budget warnings if applicable

---

### 3.4 Add Expense Page

**Purpose:**  
Allows users to add new expense records.

**Form Fields:**
- Expense Title (required, max 100 characters)
- Amount (required, numeric, positive value, up to 2 decimals)
- Category (required, dropdown from categories table)
- Date (required, date picker, cannot be future date)
- Notes (optional, max 255 characters)

**Functions:**
- Client and server-side validation
- Auto-suggests previous expense titles
- Stores expense details with timestamp

**Working Process:**
1. User fills in expense information
2. JavaScript validates input before submission
3. Form submits to PHP: `add_expense.php`
4. PHP validates inputs and sanitizes data
5. Prepared statement inserts data into `expenses` table
6. Success message: "Expense added successfully"
7. User is redirected to View Expenses page

**Error Handling:**
- Empty fields → "All required fields must be filled"
- Invalid amount → "Please enter a valid amount (e.g., 150.50)"
- Future date → "Date cannot be in the future"
- Database error → "Failed to add expense. Please try again"

---

### 3.5 Edit Expense Page

**Purpose:**  
Allows users to modify existing expense records.

**Form Fields:**
- Same as Add Expense, pre-populated with existing data

**Functions:**
- Loads existing expense data
- Validates and updates record
- Maintains audit trail (updated_at timestamp)

**Working Process:**
1. User clicks "Edit" button on an expense
2. System retrieves expense by ID
3. Form is pre-populated with existing data
4. User modifies desired fields
5. Form submits to PHP: `edit_expense.php`
6. PHP validates ownership (user can only edit their expenses)
7. Data is updated using prepared statement
8. Success message displayed
9. User redirected to View Expenses page

**Error Handling:**
- Expense not found → "Expense not found"
- Unauthorized access → "You cannot edit this expense"
- Validation errors → Same as Add Expense
- Database error → "Failed to update expense"

---

### 3.6 View Expenses Page

**Purpose:**  
Displays all expenses with filtering, searching, and sorting options.

**Displays:**
- Expense table with columns: Title, Amount, Category, Date, Notes, Actions
- Filter panel (by date range, category, amount range)
- Search bar (search by title or notes)
- Sort options (by date, amount, category)
- Pagination (20 records per page)
- Total count and sum of filtered expenses
- Export button

**Functions:**
- Retrieves and displays user expenses
- Applies filters and search
- Provides Edit and Delete options
- Shows total of displayed expenses

**Working Process:**
- PHP fetches user-specific expenses with JOIN on categories
- Applies filters from URL parameters
- Executes search query if search term provided
- Orders results based on sort selection
- Paginates results
- Displays in HTML table with action buttons

**Filter Options:**
- **Date Range:** Custom (from date - to date), This Week, This Month, Last Month, This Year
- **Category:** All Categories or specific category
- **Amount Range:** Min and Max amount
- **Search:** Text search in title and notes

---

### 3.7 Delete Expense Function

**Purpose:**  
Removes an existing expense record with confirmation.

**Functions:**
- Confirms deletion before removing
- Validates user ownership
- Soft delete option (marks as deleted instead of removing)

**Working Process:**
1. User clicks "Delete" button
2. JavaScript confirmation dialog: "Are you sure you want to delete this expense?"
3. If confirmed, AJAX request to PHP: `delete_expense.php?id={expense_id}`
4. PHP validates ownership
5. Record is deleted from database
6. Success response sent
7. Expense row is removed from UI (no page reload)
8. Total is recalculated and updated

**Error Handling:**
- Expense not found → "Expense not found"
- Unauthorized → "You cannot delete this expense"
- Database error → "Failed to delete expense"

---

### 3.8 Category Management Page

**Purpose:**  
Allows users to create, edit, and delete custom expense categories.

**Displays:**
- List of all categories (default + custom)
- Add new category form
- Edit/Delete buttons for custom categories
- Usage count for each category

**Default Categories (Cannot be deleted):**
- Food & Dining
- Transportation
- Rent & Utilities
- Healthcare
- Entertainment
- Shopping
- Education
- Others

**Functions:**
- Add custom categories
- Edit custom category names
- Delete unused custom categories
- View expense count per category

**Working Process (Add Category):**
1. User enters category name
2. Form submits to PHP: `manage_categories.php`
3. PHP validates name (unique, not empty, max 50 chars)
4. Category is inserted into `categories` table
5. Success message displayed
6. Category list is refreshed

**Working Process (Delete Category):**
1. User clicks delete on custom category
2. System checks if category is in use
3. If in use → Show warning: "Cannot delete. X expenses use this category"
4. If not in use → Confirm and delete
5. Category removed from database

**Error Handling:**
- Duplicate category → "Category already exists"
- Category in use → "Cannot delete category with expenses. Reassign expenses first"
- Cannot delete default category → "System categories cannot be deleted"

---

### 3.9 Export Data Page

**Purpose:**  
Allows users to export expense data as CSV file.

**Options:**
- Export all expenses
- Export filtered expenses (based on current filters)
- Date range selection for export

**Export Format (CSV):**
```
Title,Amount,Category,Date,Notes
Lunch,250.00,Food & Dining,2026-01-04,Office cafeteria
Taxi,120.00,Transportation,2026-01-03,
```

**Working Process:**
1. User selects export options and clicks "Export"
2. PHP query retrieves relevant expenses
3. Data is formatted as CSV
4. Headers are set: `Content-Type: text/csv`
5. File is generated: `expenses_{user_id}_{date}.csv`
6. Browser downloads the file

**Error Handling:**
- No data to export → "No expenses to export"
- Database error → "Export failed. Please try again"

---

### 3.10 Budget Management Page

**Purpose:**  
Allows users to set monthly budget limits and track spending.

**Features:**
- Set overall monthly budget
- Set category-wise budgets
- View budget vs. actual spending
- Budget alerts when approaching/exceeding limit

**Displays:**
- Budget setting form
- Current month spending vs. budget
- Progress bars for each budget category
- Alert indicators (Green: Under budget, Yellow: 80-100%, Red: Over budget)

**Working Process:**
1. User sets monthly budget amount
2. Data saved in `budgets` table
3. Dashboard shows budget status
4. Warnings displayed when spending exceeds 80% of budget

---

### 3.11 Logout Function

**Purpose:**  
Ends the user session securely.

**Functions:**
- Destroys session data
- Clears authentication cookies
- Redirects to Sign In page

**Working Process:**
1. User clicks "Logout" button
2. Request sent to Node.js: `POST /api/auth/logout`
3. Session is destroyed on server
4. Session cookie is cleared
5. User is redirected to Sign In page
6. Confirmation message: "You have been logged out successfully"

---

## 4. Detailed Database Design

### 4.1 Users Table
```sql
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,  -- bcrypt hashed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    failed_login_attempts INT DEFAULT 0,
    account_locked_until DATETIME NULL,
    INDEX idx_email (email)
);
```

### 4.2 Categories Table
```sql
CREATE TABLE categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NULL,  -- NULL for default categories, user_id for custom
    category_name VARCHAR(50) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_category (user_id, category_name)
);
```

### 4.3 Expenses Table
```sql
CREATE TABLE expenses (
    expense_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    category_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    expense_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(category_id),
    INDEX idx_user_date (user_id, expense_date),
    INDEX idx_category (category_id)
);
```

### 4.4 Budgets Table
```sql
CREATE TABLE budgets (
    budget_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    category_id INT NULL,  -- NULL for overall budget
    month DATE NOT NULL,  -- First day of month
    budget_amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(category_id),
    UNIQUE KEY unique_user_month_category (user_id, month, category_id)
);
```

### 4.5 Sessions Table (for Node.js session storage)
```sql
CREATE TABLE sessions (
    session_id VARCHAR(255) PRIMARY KEY,
    user_id INT NOT NULL,
    session_data TEXT,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_expires (expires_at)
);
```

---

## 5. API Documentation (Node.js Authentication API)

### Base URL: `http://localhost:3000/api/auth`

### 5.1 Sign Up
**Endpoint:** `POST /api/auth/signup`

**Request Body:**
```json
{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePass123",
    "confirm_password": "securePass123"
}
```

**Success Response (201):**
```json
{
    "success": true,
    "message": "Registration successful",
    "redirect": "/signin.html"
}
```

**Error Response (400/500):**
```json
{
    "success": false,
    "message": "Error message here"
}
```

### 5.2 Sign In
**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
    "email": "john@example.com",
    "password": "securePass123",
    "remember_me": false
}
```

**Success Response (200):**
```json
{
    "success": true,
    "message": "Login successful",
    "user": {
        "user_id": 1,
        "name": "John Doe",
        "email": "john@example.com"
    },
    "session_token": "session_token_here",
    "redirect": "/dashboard.php"
}
```

### 5.3 Logout
**Endpoint:** `POST /api/auth/logout`

**Headers:** `Authorization: Bearer {session_token}`

**Success Response (200):**
```json
{
    "success": true,
    "message": "Logged out successfully"
}
```

### 5.4 Session Validation (for PHP to verify sessions)
**Endpoint:** `POST /api/auth/verify`

**Request Body:**
```json
{
    "session_token": "token_here"
}
```

**Success Response (200):**
```json
{
    "valid": true,
    "user_id": 1,
    "email": "john@example.com"
}
```

---

## 6. Security Considerations

### 6.1 Password Security
- Passwords hashed using **bcrypt** with 10 salt rounds
- Minimum password length: 8 characters
- Password strength indicator on registration
- No password recovery (use reset link via email in future versions)

### 6.2 SQL Injection Prevention
- All database queries use **prepared statements** (PDO for PHP)
- Input sanitization using `mysqli_real_escape_string()` or PDO parameters
- Never concatenate user input into SQL queries

### 6.3 XSS (Cross-Site Scripting) Prevention
- All user inputs are escaped using `htmlspecialchars()` before display
- Output encoding for all dynamic content
- Content Security Policy headers

### 6.4 CSRF (Cross-Site Request Forgery) Protection
- CSRF tokens generated for all forms
- Token validation on server-side before processing
- Tokens stored in session and verified on submission

### 6.5 Session Security
- Session IDs regenerated after login
- Sessions expire after 30 minutes of inactivity
- Secure session cookies (HttpOnly, SameSite flags)
- Session data stored server-side (database or file system)

### 6.6 Authentication
- Failed login attempt tracking (max 5 attempts)
- Account lockout for 15 minutes after 5 failed attempts
- Logout on password change
- Session timeout implementation

### 6.7 Authorization
- Users can only access their own expenses
- Ownership validation on all Edit/Delete operations
- User ID verified from session, not from request parameters

### 6.8 Input Validation
- Client-side validation (JavaScript) for user experience
- **Server-side validation (critical)** for security
- Whitelist validation for categories and enums
- Numeric validation for amounts
- Date format validation

### 6.9 HTTPS Requirement
- Production deployment must use HTTPS
- Redirect HTTP to HTTPS
- Secure cookie flag enabled in production

---

## 7. Error Handling Strategy

### 7.1 User-Facing Errors
Display friendly, actionable error messages:
- ✅ "This email is already registered. Please use a different email or sign in."
- ❌ Not: "Duplicate entry '...' for key 'email_UNIQUE'"

### 7.2 Error Logging
- All errors logged to `logs/error.log` with timestamp
- Database errors logged with query context (without sensitive data)
- Failed login attempts logged for security monitoring

### 7.3 Error Categories

**Validation Errors (400):**
- Missing required fields
- Invalid format (email, date, amount)
- Out of range values

**Authentication Errors (401):**
- Invalid credentials
- Session expired
- Unauthorized access

**Resource Errors (404):**
- Expense not found
- Category not found
- User not found

**Server Errors (500):**
- Database connection failure
- File write errors
- Unexpected exceptions

### 7.4 Error Response Format

**For API (JSON):**
```json
{
    "success": false,
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "Invalid input data",
        "fields": {
            "amount": "Amount must be a positive number"
        }
    }
}
```

**For Web Pages (HTML):**
- Display error alert box at top of form
- Highlight fields with errors in red
- Show specific error message below each field

---

## 8. Non-Functional Requirements

### 8.1 Performance
- Page load time: < 2 seconds on average connection
- Database queries: < 500ms for standard operations
- Export file generation: < 5 seconds for up to 1000 records
- Support for up to 50 concurrent users

### 8.2 Browser Compatibility
- Google Chrome (latest 2 versions)
- Mozilla Firefox (latest 2 versions)
- Microsoft Edge (latest 2 versions)
- Safari (latest 2 versions)

### 8.3 Accessibility
- Keyboard navigation support
- Form labels properly associated with inputs
- Error messages announced by screen readers
- Sufficient color contrast (WCAG AA standard)

### 8.4 Usability
- Responsive design (works on tablet and mobile)
- Consistent UI/UX across all pages
- Clear navigation and breadcrumbs
- Confirmation dialogs for destructive actions

### 8.5 Data Validation Rules
- **Name:** 3-100 characters, letters and spaces only
- **Email:** Valid email format, max 255 characters
- **Password:** Min 8 characters, at least one letter and one number
- **Amount:** Positive decimal, max 10 digits, 2 decimal places
- **Title:** 1-100 characters
- **Notes:** Max 255 characters
- **Date:** Valid date, not in future

---

## 9. Testing Strategy

### 9.1 Unit Testing
**Authentication Module (Node.js):**
- Test password hashing and verification
- Test email validation
- Test duplicate email detection

**Expense Module (PHP):**
- Test expense CRUD operations
- Test filter and search logic
- Test total calculation accuracy

### 9.2 Integration Testing
- Test session creation (Node.js) and validation (PHP)
- Test database transactions
- Test file export functionality

### 9.3 Manual Testing Checklist

**Registration:**
- [ ] Valid registration succeeds
- [ ] Duplicate email is rejected
- [ ] Password mismatch is detected
- [ ] Weak password is rejected

**Login:**
- [ ] Valid credentials allow login
- [ ] Invalid credentials are rejected
- [ ] Account locks after 5 failed attempts
- [ ] Session persists across pages

**Expense Management:**
- [ ] Can add expense with all fields
- [ ] Can edit own expense
- [ ] Cannot edit other user's expense
- [ ] Can delete expense with confirmation
- [ ] Totals calculate correctly

**Filters:**
- [ ] Date range filter works
- [ ] Category filter works
- [ ] Search finds matching expenses
- [ ] Combined filters work together

**Category Management:**
- [ ] Can create custom category
- [ ] Cannot create duplicate category
- [ ] Can delete unused category
- [ ] Cannot delete category in use

**Export:**
- [ ] CSV export contains correct data
- [ ] File downloads successfully
- [ ] Filtered data exports correctly

**Security:**
- [ ] SQL injection attempts are prevented
- [ ] XSS attempts are escaped
- [ ] CSRF tokens are validated
- [ ] Session expires after timeout

### 9.4 Test Data
Create test accounts with varying expense data:
- User 1: 50 expenses across 3 months
- User 2: 5 expenses (edge case - minimal data)
- User 3: 200+ expenses (performance testing)

---

## 10. Updated Functional Summary

| Function Name | Description |
|--------------|------------|
| Sign Up | Creates a new user account with validation |
| Sign In | Authenticates user and creates session |
| Add Expense | Stores expense data with category |
| Edit Expense | Updates existing expense record |
| View Expenses | Displays expenses with filters and search |
| Filter Expenses | Filters by date, category, amount |
| Search Expenses | Text search in title and notes |
| Delete Expense | Removes expense with confirmation |
| Manage Categories | Add, edit, delete custom categories |
| Export Data | Download expenses as CSV |
| Set Budget | Define monthly spending limits |
| View Budget | Track spending vs. budget |
| Calculate Total | Calculates total spending with filters |
| Logout | Ends user session securely |

---

## 11. Updated System Workflow

```
1. User Registration
   ├─> Fill sign-up form
   ├─> Validation (client + server)
   ├─> Password hashing (bcrypt)
   ├─> Store in database
   └─> Redirect to Sign In

2. User Authentication
   ├─> Enter credentials
   ├─> Node.js validates against database
   ├─> Create session token
   ├─> PHP validates session for each request
   └─> Access granted to dashboard

3. Expense Management
   ├─> Add Expense
   │   ├─> Select category
   │   ├─> Enter details
   │   └─> Save to database
   │
   ├─> View Expenses
   │   ├─> Apply filters (date, category, amount)
   │   ├─> Search by keyword
   │   ├─> Sort results
   │   └─> Display paginated results
   │
   ├─> Edit Expense
   │   ├─> Load expense data
   │   ├─> Modify fields
   │   ├─> Validate ownership
   │   └─> Update database
   │
   └─> Delete Expense
       ├─> Confirm deletion
       ├─> Validate ownership
       └─> Remove from database

4. Category Management
   ├─> View all categories (default + custom)
   ├─> Add custom category
   ├─> Edit category name
   └─> Delete unused category

5. Data Export
   ├─> Select filters/date range
   ├─> Generate CSV file
   └─> Download to user's device

6. Budget Tracking
   ├─> Set monthly budget
   ├─> View spending vs. budget
   └─> Receive alerts if overspending

7. Logout
   └─> Destroy session and redirect
```

---

## 12. Assumptions and Constraints

### Assumptions:
- Users have a modern web browser (Chrome, Firefox, Edge, Safari)
- Users have basic computer literacy
- Internet connection is available
- Server supports PHP 7.4+ and Node.js 14+
- MySQL 5.7+ is available

### Constraints:
- Single currency support (no multi-currency)
- No mobile app (web-only)
- No email functionality (password reset, notifications)
- No data visualization/charts (excluded as per requirement)
- No receipt image upload
- No collaborative features (multi-user expense sharing)
- No recurring expense automation

---

## 13. Future Enhancements (Out of Scope for V1)

- Email notifications and password reset
- Receipt image upload and OCR
- Data visualization with charts and graphs
- Mobile app (Android/iOS)
- Multi-currency support
- Recurring expenses
- Income tracking
- Expense splitting (shared expenses)
- Export to PDF and Excel formats
- Dark mode UI theme
- Two-factor authentication (2FA)

---

**End of PRD Document**