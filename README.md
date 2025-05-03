# 🌾 Farmer Marketplace — Crop Bidding Platform
Farmer Marketplace is a full-stack web application that connects Farmers and Buyers through a digital crop bidding system. Built using Spring Boot (Backend) and React.js (Frontend), the platform enables role-based access for Farmers, Buyers, and Admins, offering features like bidding, secure transactions via Razorpay, and transaction tracking.

🎯 Aim of the Project
The primary aim of this project is to digitize and simplify the crop-selling process by creating a transparent, real-time bidding system where:

Farmers can post and manage their crops,

Buyers can place competitive bids and make payments,

Admins can monitor the platform, manage users, and export transaction reports.

This project intends to eliminate middlemen, empower local farmers, and promote fair pricing and faster sales using modern web technologies.


---

## ✨ Features

### 🔐 Authentication
- Secure JWT-based login and registration
- Role-based dashboards: **FARMER**, **BUYER**, **ADMIN**

### 👨‍🌾 Farmer Dashboard
- Post and manage crops
- View bids per crop
- Accept bids to create transactions
- Track payment and delivery status

### 🧑‍💼 Buyer Dashboard
- Browse and bid on available crops
- View your bids and transactions
- Make payments via Razorpay
- Mark delivery status

### 🛡️ Admin Dashboard
- Manage all users and crops
- View all transactions
- Delete users or crops if necessary

---

## 🛠 Tech Stack

### Backend (Spring Boot)
- Spring Boot + Spring Security
- JWT Authentication
- MySQL + JPA/Hibernate
- Lombok

### Frontend (React)
- React.js
- Axios
- Tailwind CSS
- React Router
- Razorpay Checkout Integration

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/farmer-marketplace.git
cd farmer-marketplace
```

---

## 🔧 Backend Setup (`/backend`)

### Step 1: Configure MySQL & Razorpay

Edit `src/main/resources/application.properties`:

```properties
# MySQL Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/fm
spring.datasource.username=root
spring.datasource.password=your_mysql_password

# Razorpay Configuration
razorpay.key=YOUR_RAZORPAY_KEY
razorpay.secret=YOUR_RAZORPAY_SECRET
```

### Step 2: Run Backend

```bash
./mvnw spring-boot:run
```

Backend will start on: `http://localhost:8080`

---

## 💻 Frontend Setup (`/frontend`)

### Step 1: Install Dependencies

```bash
cd frontend
npm install
```

### Step 2: Add Razorpay Key

Create a `.env` file in the `/frontend` folder:

```env
REACT_APP_RAZORPAY_KEY=YOUR_RAZORPAY_KEY
```

> This key is required to load the Razorpay payment form in the Buyer Dashboard.

### Step 3: Start React App

```bash
npm start
```

Frontend will run on: [http://localhost:3000](http://localhost:3000)

---

## 🔐 Sample Admin Login

```json
POST /auth/login
{
  "email": "admin1@example.com",
  "password": "admin123"
}
```

---

## 📡 API Endpoints

### Auth
- `POST /auth/register`
- `POST /auth/login`

### Farmer
- `GET /farmer/crops`
- `POST /farmer/crops`
- `GET /farmer/crops/{id}/bids`
- `POST /farmer/crops/{id}/accept/{bidId}`
- `GET /farmer/transactions`

### Buyer
- `GET /buyer/crops`
- `POST /buyer/bids/{cropId}`
- `GET /buyer/bids`
- `GET /buyer/transactions`
- `PUT /buyer/transactions/{id}/pay`
- `PUT /buyer/transactions/{id}/deliver`

### Admin
- `GET /admin/users`
- `DELETE /admin/users/{id}`
- `GET /admin/crops`
- `DELETE /admin/crops/{id}`
- `GET /admin/transactions`


---

## 📸 Screenshots

///// uploading soon

---

## 🔮 Future Improvements

- Crop image uploads
- Real-time notifications for bids
- Payment success webhooks
- Admin analytics dashboard

---



## 👨‍💻 Author

Developed by [**Gaurav Wahatule**](https://github.com/Gaurav-guru)

