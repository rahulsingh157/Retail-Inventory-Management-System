import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { Layout } from './layout/layout';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';

import { Dashboard } from './pages/dashboard/dashboard';
import { Products } from './pages/products/products';
import { Categories } from './pages/categories/categories';
import { Suppliers } from './pages/suppliers/suppliers';
import { Customers } from './pages/customers/customers';
import { StockMovements } from './pages/stock-movements/stock-movements';
import { Orders } from './pages/orders/orders';
import { OrderItems } from './pages/order-items/order-items';

import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: Home
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'register',
    component: Register
  },
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        component: Dashboard
      },
      {
        path: 'products',
        component: Products
      },
      {
        path: 'categories',
        component: Categories
      },
      {
        path: 'suppliers',
        component: Suppliers
      },
      {
        path: 'customers',
        component: Customers
      },
      {
        path: 'stock-movements',
        component: StockMovements
      },
      {
        path: 'orders',
        component: Orders
      },
      {
        path: 'order-items',
        component: OrderItems
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];