# Retail Inventory Management System (RIMS)

A full-stack Retail Inventory Management System developed using Angular, Spring Boot, JPA/Hibernate, and MySQL.

## 📌 Project Overview

The Retail Inventory Management System (RIMS) is designed to provide a centralized platform for managing important retail operations such as products, categories, suppliers, customers, inventory, stock movements, sales orders, and order items.

The system helps organize inventory data and provides a simple web-based interface for managing retail operations.

## 🎯 Objectives

- Centralize retail inventory information
- Manage products and categories
- Manage suppliers and customers
- Track stock movements
- Monitor low-stock products
- Manage sales orders and order items
- Provide dashboard-based inventory insights
- Provide secure user authentication

## ✨ Key Features

### 🔐 Authentication
- User registration and login
- JWT-based authentication
- Protected application routes
- Secure password handling

### 📦 Product Management
- Add products
- View products
- Delete products
- Manage product quantity and category information

### 🏷️ Category Management
- Add categories
- View categories
- Delete categories

### 🚚 Supplier Management
- Manage supplier information
- Store supplier contact details
- View and delete suppliers

### 👥 Customer Management
- Manage customer information
- Store customer contact details
- View and delete customers

### 📊 Stock Management
- Record Stock IN movements
- Record Stock OUT movements
- Automatically update product quantity
- Prevent stock from becoming negative
- Track stock movement history
- Detect low-stock products

### 🛒 Sales Order Management
- Create sales orders
- Assign orders to customers
- Track order status
- Manage order dates and total amounts

### 📋 Order Items
- Connect products with sales orders
- Manage quantity and price
- Calculate item totals

### 📈 Dashboard
- Total products
- Total categories
- Total suppliers
- Total customers
- Low-stock products
- Recent stock movements
- Recent orders

## 🛠️ Technology Stack

### Frontend
- Angular
- TypeScript
- HTML
- CSS

### Backend
- Java
- Spring Boot
- Spring Security
- REST APIs

### Database
- MySQL

### ORM
- Spring Data JPA
- Hibernate

### Authentication
- JWT
- BCrypt password hashing

### Development Tools
- VS Code
- Maven
- Git
- GitHub

## 🏗️ System Architecture

```text
User
  ↓
Angular Frontend
  ↓
HTTP / REST API
  ↓
Spring Boot Controllers
  ↓
Service Layer
  ↓
Repository Layer
  ↓
JPA / Hibernate
  ↓
MySQL Database