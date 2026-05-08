# Midspace Backend API

## Requirements
- .NET 8 SDK
- SQL Server (LocalDB is fine for dev)

## How to Run

1. **Install dependencies:**
   ```bash
   dotnet restore
   ```

2. **Update Database:**
   ```bash
   dotnet ef database update
   ```
   *Note: The app also tries to migrate automatically on startup.*

3. **Run the API:**
   ```bash
   dotnet run
   ```

The API will be available at `https://localhost:5001` or `http://localhost:5000`.
Swagger UI is available at `https://localhost:5001/swagger`.

## Default Accounts

- **Admin:** `admin@midspace.com` / `Admin123`
- **Doctor:** `doctor@midspace.com` / `Doctor123`
- **Patient:** `patient@midspace.com` / `Patient123`
