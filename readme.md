AssetFlow ERP Database
1. Roles
roles
---------
id UUID PK
role_name
description
created_at
updated_at

Example

1 Admin
2 Asset Manager
3 Department Head
4 Employee
2. Permissions
permissions
-------------
id UUID PK
permission_name
module
description

Example

CREATE_ASSET

DELETE_ASSET

APPROVE_MAINTENANCE

BOOK_RESOURCE
3. Role Permissions
role_permissions
--------------------
role_id FK
permission_id FK

Instead of checking

if(role=="Admin")

You check

User
↓

Role

↓

Permission

This is how enterprise software works.

4. Departments
departments
--------------------
id UUID PK
department_name
department_code
parent_department_id FK
head_employee_id FK
status
created_by
created_at
updated_at

Example

Engineering

HR

Finance

Administration
5. Employees
employees
----------------------
id UUID PK
employee_code
first_name
last_name
email
phone
department_id FK
designation
joining_date
employment_status
manager_id FK
created_at
updated_at
6. User Accounts

Authentication should not be mixed with employee details.

users
--------------------
id UUID PK
employee_id FK
username
password_hash
last_login
account_status
failed_login_attempts
password_changed_at
created_at
updated_at
7. User Roles
user_roles
---------------------
user_id FK
role_id FK
assigned_by
assigned_at
8. Asset Categories
asset_categories
----------------------
id UUID PK
category_name
description
depreciation_years
created_at
9. Category Custom Fields
category_fields
---------------------
id UUID PK
category_id FK
field_name
field_type
required

Example

Electronics

Warranty

Brand

RAM

Processor

Vehicle

Registration Number

Fuel Type

Insurance
10. Vendors

Real companies know where assets came from.

vendors
--------------------
id UUID PK
vendor_name
contact_person
email
phone
address
gst_number
11. Locations
locations
---------------------
id UUID PK
building
floor
room
city
state
country
12. Assets
assets
-----------------------
id UUID PK
asset_tag UNIQUE
serial_number UNIQUE
asset_name
category_id FK
vendor_id FK
department_id FK
location_id FK
purchase_date
purchase_cost
warranty_expiry
condition
status
bookable
barcode
qr_code
image_url
created_by
created_at
updated_at

Status

Available

Allocated

Reserved

Maintenance

Lost

Disposed

Retired
13. Asset Documents
asset_documents
-----------------------
id UUID PK
asset_id FK
document_type
file_url
uploaded_by
uploaded_at

Store

Invoice

Warranty Card

Image

Manual
14. Asset Allocation
asset_allocations
--------------------------
id UUID PK
asset_id FK
employee_id FK
allocated_by FK
allocation_date
expected_return_date
actual_return_date
status

Status

Allocated

Returned

Overdue
15. Asset Transfer Requests
transfer_requests
--------------------------
id UUID PK
asset_id FK
requested_by
current_holder
new_holder
approved_by
approval_status
remarks
created_at
completed_at
16. Shared Resources
resources
----------------------
id UUID PK
asset_id FK
resource_type
capacity
availability_status

Example

Meeting Room

Lab

Vehicle

Projector
17. Resource Bookings
resource_bookings
--------------------------
id UUID PK
resource_id FK
employee_id FK
start_datetime
end_datetime
purpose
booking_status
created_at

Status

Upcoming

Ongoing

Completed

Cancelled
18. Maintenance Requests
maintenance_requests
----------------------------
id UUID PK
asset_id FK
reported_by FK
assigned_to FK
approved_by FK
issue_title
description
priority
status
estimated_cost
actual_cost
created_at
completed_at

Priority

Low

Medium

High

Critical

Workflow

Pending

Approved

Assigned

In Progress

Resolved

Closed
19. Maintenance Attachments
maintenance_files
-------------------------
id UUID PK
maintenance_id FK
file_url
uploaded_by
uploaded_at
20. Audit Cycles
audit_cycles
-----------------------
id UUID PK
audit_name
department_id FK
start_date
end_date
created_by
status
21. Audit Assignments
audit_assignments
-------------------------
id UUID PK
audit_cycle_id FK
auditor_id FK
assigned_date
22. Audit Results
audit_results
-------------------------
id UUID PK
audit_cycle_id FK
asset_id FK
auditor_id FK
verification_status
remarks
verified_at

Status

Verified

Missing

Damaged
23. Notifications
notifications
------------------------
id UUID PK
employee_id FK
title
message
notification_type
is_read
created_at
24. Activity Logs
activity_logs
-------------------------
id UUID PK
employee_id FK
action
module
entity_id
old_data JSONB
new_data JSONB
ip_address
user_agent
created_at
25. Asset History

Never overwrite asset status.

asset_history
------------------------
id UUID PK
asset_id FK
previous_status
new_status
remarks
changed_by
changed_at

Example

Available

↓

Allocated

↓

Maintenance

↓

Available

↓

Retired
26. Login Sessions
login_sessions
------------------------
id UUID PK
user_id FK
jwt_token
device
browser
ip_address
login_time
logout_time
is_active
27. Password Reset Tokens
password_reset_tokens
------------------------------
id UUID PK
user_id FK
token
expires_at
used