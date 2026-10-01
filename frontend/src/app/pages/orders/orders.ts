import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService, SalesOrder } from '../../services/order.service';
import { CustomerService, Customer } from '../../services/customer.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class Orders implements OnInit {

  private orderService = inject(OrderService);
  private customerService = inject(CustomerService);
  private cdr = inject(ChangeDetectorRef);

  orders: SalesOrder[] = [];
  customers: Customer[] = [];

  loading = true;
  showForm = false;
  searchText = '';

  newOrder = {
    customerId: null as number | null,
    orderDate: this.getDefaultDate(),
    totalAmount: 0,
    status: 'COMPLETED'
  };

  ngOnInit(): void {
    this.loadData();
  }

  getDefaultDate(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  loadData(): void {
    this.loading = true;
    this.cdr.markForCheck();

    this.customerService.getCustomers().subscribe({
      next: (custs) => {
        this.customers = custs ?? [];
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Error loading customers:', err)
    });

    this.orderService.getOrders().subscribe({
      next: (data) => {
        this.orders = data ?? [];
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error loading orders:', err);
        this.orders = [];
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  openForm(): void {
    this.showForm = true;
    this.newOrder = {
      customerId: this.customers.length > 0 ? (this.customers[0].id ?? null) : null,
      orderDate: this.getDefaultDate(),
      totalAmount: 0,
      status: 'COMPLETED'
    };
    this.cdr.markForCheck();
  }

  closeForm(): void {
    this.showForm = false;
    this.cdr.markForCheck();
  }

  addOrder(): void {
    if (!this.newOrder.customerId) {
      alert('Please select a customer for the order.');
      return;
    }

    if (this.newOrder.totalAmount <= 0) {
      alert('Please enter a total amount greater than zero.');
      return;
    }

    const selectedCust = this.customers.find(c => c.id === Number(this.newOrder.customerId));

    const orderToSave: SalesOrder = {
      customer: selectedCust ? { id: selectedCust.id, name: selectedCust.name, email: selectedCust.email, phone: selectedCust.phone, address: selectedCust.address } : null,
      orderDate: this.newOrder.orderDate ? this.newOrder.orderDate : new Date().toISOString(),
      totalAmount: Number(this.newOrder.totalAmount),
      status: this.newOrder.status
    };

    this.orderService.addOrder(orderToSave).subscribe({
      next: () => {
        this.showForm = false;
        this.loadData();
        alert('Order added successfully!');
      },
      error: (err) => {
        console.error('Error creating order:', err);
        alert('Failed to add order.');
      }
    });
  }

  deleteOrder(id: number | undefined): void {
    if (!id) return;

    const confirmed = confirm(`Are you sure you want to delete Order #${id}?`);
    if (!confirmed) return;

    this.orderService.deleteOrder(id).subscribe({
      next: () => {
        this.orders = this.orders.filter(o => o.id !== id);
        this.cdr.markForCheck();
        alert('Order deleted successfully!');
      },
      error: (err) => {
        console.error('Error deleting order:', err);
        alert('Failed to delete order.');
      }
    });
  }

  get filteredOrders(): SalesOrder[] {
    const search = this.searchText.toLowerCase().trim();
    if (!search) {
      return this.orders;
    }

    return this.orders.filter(order =>
      (order.id?.toString() || '').includes(search) ||
      (order.customer?.name || '').toLowerCase().includes(search) ||
      (order.status || '').toLowerCase().includes(search) ||
      (order.totalAmount?.toString() || '').includes(search)
    );
  }
}
