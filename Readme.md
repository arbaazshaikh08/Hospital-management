# 🏥 Hospital Management System (Backend)

A role-based backend system for hospital appointment booking and management. Supports **patients**, **doctors**, and **admin** with secure authentication and modular APIs built using **Node.js**, **Express**, and **MongoDB**.

---

## 🚀 Features

| Feature                                       | Status     | Description                                                                 |
|----------------------------------------------|------------|-----------------------------------------------------------------------------|
| 🔐 JWT Authentication                        | ✅ Complete | Secure login/register for users and doctors                                 |
| 👩‍⚕️ Doctor Registration & Approval          | ✅ Complete | Admin must approve doctors after registration                               |
| 📅 Appointment Booking                       | ✅ Complete | Patients can request appointments with doctors                              |
| ✋ Admin Approval of Appointments             | ✅ Complete | Admin or Doctor can approve/reject appointments                             |
| 📬 In-App Notifications                      | ✅ Complete | Notifications system stored in MongoDB                                      |
| 🧑‍⚕️ Role-Based Access Control               | ✅ Complete | Separate routes and access for admin, doctors, and users                                   

---

## 🧠 Tech Stack

| Layer         | Technology                      |
|---------------|----------------------------------|
| Backend       | Node.js, Express.js              |
| Database      | MongoDB with Mongoose ODM        |
| Auth          | JWT + bcryptjs                   |
| Middleware    | Custom auth & role middleware    |
| Environment   | dotenv for `.env` configuration  |

---


