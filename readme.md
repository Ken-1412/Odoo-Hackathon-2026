## 🗄️ Database

AssetFlow uses **PostgreSQL** as its primary relational database to ensure secure, reliable, and scalable data management.

### Why PostgreSQL?

- High-performance relational database
- ACID-compliant transactions
- Supports complex queries and indexing
- Reliable backup and recovery
- Open-source and highly scalable

### Installation

#### Ubuntu

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

#### Windows

Download PostgreSQL from:
https://www.postgresql.org/download/windows/

### Create Database

Login to PostgreSQL

```bash
psql -U postgres
```

Create a database

```sql
CREATE DATABASE assetflow;
```

Create a user

```sql
CREATE USER assetflow_user WITH PASSWORD 'your_password';
```

Grant privileges

```sql
GRANT ALL PRIVILEGES ON DATABASE assetflow TO assetflow_user;
```

### Database Configuration

Example environment variables:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=assetflow
DB_USER=assetflow_user
DB_PASSWORD=your_password
```

### Tech Stack

- Frontend
- Backend
- **PostgreSQL** (Database)
- REST API