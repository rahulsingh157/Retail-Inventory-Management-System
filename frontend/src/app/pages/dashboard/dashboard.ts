import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize, timeout } from 'rxjs/operators';

export interface Product {
  id?: number;
  name: string;
  description?: string;
  category: string;
  quantity: number;
}

export interface StockMovement {
  id?: number;
  product?: Product | null;
  type: string;
  quantity: number;
  reason?: string;
  movementDate?: string;
}

export interface SalesOrder {
  id?: number;
  customer?: { id?: number; name?: string; email?: string } | null;
  orderDate?: string;
  totalAmount: number;
  status: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  private http = inject(HttpClient);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  loading = true;

  productCount = 0;
  categoryCount = 0;
  supplierCount = 0;
  customerCount = 0;

  products: Product[] = [];
  lowStockProducts: Product[] = [];
  recentMovements: StockMovement[] = [];
  recentOrders: SalesOrder[] = [];

  ngOnInit(): void {
    console.log('Dashboard: Component initialized. Starting loadDashboard(). Initial loading state:', this.loading);
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading = true;
    this.cdr.markForCheck();
    console.log('Dashboard: loadDashboard() called. Setting loading = true.');

    const requestTimeoutMs = 8000;

    forkJoin({
      products: this.http.get<Product[]>('http://localhost:8080/products').pipe(
        timeout(requestTimeoutMs),
        catchError(err => {
          console.error('Dashboard: error/timeout on /products:', err);
          return of([]);
        })
      ),
      categories: this.http.get<any[]>('http://localhost:8080/categories').pipe(
        timeout(requestTimeoutMs),
        catchError(err => {
          console.error('Dashboard: error/timeout on /categories:', err);
          return of([]);
        })
      ),
      suppliers: this.http.get<any[]>('http://localhost:8080/suppliers').pipe(
        timeout(requestTimeoutMs),
        catchError(err => {
          console.error('Dashboard: error/timeout on /suppliers:', err);
          return of([]);
        })
      ),
      customers: this.http.get<any[]>('http://localhost:8080/customers').pipe(
        timeout(requestTimeoutMs),
        catchError(err => {
          console.error('Dashboard: error/timeout on /customers:', err);
          return of([]);
        })
      ),
      movements: this.http.get<StockMovement[]>('http://localhost:8080/stock-movements').pipe(
        timeout(requestTimeoutMs),
        catchError(err => {
          console.error('Dashboard: error/timeout on /stock-movements:', err);
          return of([]);
        })
      ),
      orders: this.http.get<SalesOrder[]>('http://localhost:8080/orders').pipe(
        timeout(requestTimeoutMs),
        catchError(err => {
          console.error('Dashboard: error/timeout on /orders:', err);
          return of([]);
        })
      )
    })
    .pipe(
      finalize(() => {
        this.loading = false;
        this.cdr.markForCheck();
        console.log('Dashboard: finalize() executed. Set loading = false. Final value:', this.loading);
      })
    )
    .subscribe({
      next: (data) => {
        console.log('Dashboard: forkJoin data received successfully:', data);
        try {
          const products = Array.isArray(data.products) ? data.products : [];
          const categories = Array.isArray(data.categories) ? data.categories : [];
          const suppliers = Array.isArray(data.suppliers) ? data.suppliers : [];
          const customers = Array.isArray(data.customers) ? data.customers : [];
          const movements = Array.isArray(data.movements) ? data.movements : [];
          const orders = Array.isArray(data.orders) ? data.orders : [];

          this.products = products;
          this.productCount = products.length;
          this.categoryCount = categories.length;
          this.supplierCount = suppliers.length;
          this.customerCount = customers.length;

          // Safe filter for low stock products (quantity <= 5)
          this.lowStockProducts = products.filter(p => p && typeof p.quantity === 'number' && p.quantity <= 5);

          // Top 5 recent movements (reverse chronological)
          this.recentMovements = [...movements].reverse().slice(0, 5);

          // Top 5 recent orders (reverse chronological)
          this.recentOrders = [...orders].reverse().slice(0, 5);

          console.log(`Dashboard metrics ready: Products=${this.productCount}, Categories=${this.categoryCount}, Suppliers=${this.supplierCount}, Customers=${this.customerCount}, LowStock=${this.lowStockProducts.length}`);
        } catch (err) {
          console.error('Dashboard: error processing payload in next:', err);
        } finally {
          this.loading = false;
          this.cdr.markForCheck();
        }
      },
      error: (error) => {
        console.error('Dashboard: error in forkJoin subscription:', error);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}