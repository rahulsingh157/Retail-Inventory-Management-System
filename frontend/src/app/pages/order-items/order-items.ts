import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderItemService, OrderItem } from '../../services/order-item.service';
import { OrderService, SalesOrder } from '../../services/order.service';
import { ProductService, Product } from '../../services/product.service';

@Component({
  selector: 'app-order-items',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-items.html',
  styleUrl: './order-items.css'
})
export class OrderItems implements OnInit {

  private orderItemService = inject(OrderItemService);
  private orderService = inject(OrderService);
  private productService = inject(ProductService);
  private cdr = inject(ChangeDetectorRef);

  orderItems: OrderItem[] = [];
  orders: SalesOrder[] = [];
  products: Product[] = [];

  loading = true;
  showForm = false;
  searchText = '';

  newOrderItem = {
    orderId: null as number | null,
    productId: null as number | null,
    quantity: 1,
    price: 0
  };

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.cdr.markForCheck();

    this.orderService.getOrders().subscribe({
      next: (orders) => {
        this.orders = orders ?? [];
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Error loading orders:', err)
    });

    this.productService.getProducts().subscribe({
      next: (prods) => {
        this.products = prods ?? [];
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Error loading products:', err)
    });

    this.orderItemService.getOrderItems().subscribe({
      next: (items) => {
        this.orderItems = items ?? [];
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error loading order items:', err);
        this.orderItems = [];
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  openForm(): void {
    this.showForm = true;
    this.newOrderItem = {
      orderId: this.orders.length > 0 ? (this.orders[0].id ?? null) : null,
      productId: this.products.length > 0 ? (this.products[0].id ?? null) : null,
      quantity: 1,
      price: 10
    };
    this.cdr.markForCheck();
  }

  closeForm(): void {
    this.showForm = false;
    this.cdr.markForCheck();
  }

  get calculatedTotal(): number {
    const qty = Number(this.newOrderItem.quantity) || 0;
    const prc = Number(this.newOrderItem.price) || 0;
    return qty * prc;
  }

  getItemTotal(item: OrderItem): number {
    if (item.totalPrice != null && item.totalPrice > 0) {
      return item.totalPrice;
    }
    return (item.quantity || 0) * (item.price || 0);
  }

  addOrderItem(): void {
    if (!this.newOrderItem.orderId) {
      alert('Please select a Sales Order.');
      return;
    }

    if (!this.newOrderItem.productId) {
      alert('Please select a Product.');
      return;
    }

    if (this.newOrderItem.quantity <= 0) {
      alert('Quantity must be greater than 0.');
      return;
    }

    if (this.newOrderItem.price <= 0) {
      alert('Price must be greater than 0.');
      return;
    }

    const selectedOrder = this.orders.find(o => o.id === Number(this.newOrderItem.orderId));
    const selectedProduct = this.products.find(p => p.id === Number(this.newOrderItem.productId));
    const total = Number(this.newOrderItem.quantity) * Number(this.newOrderItem.price);

    const itemToSave: OrderItem = {
      order: selectedOrder ? selectedOrder : null,
      product: selectedProduct ? selectedProduct : null,
      quantity: Number(this.newOrderItem.quantity),
      price: Number(this.newOrderItem.price),
      totalPrice: total
    };

    this.orderItemService.addOrderItem(itemToSave).subscribe({
      next: () => {
        this.showForm = false;
        this.loadData();
        alert('Order item added successfully!');
      },
      error: (err) => {
        console.error('Error adding order item:', err);
        alert('Failed to add order item.');
      }
    });
  }

  deleteOrderItem(id: number | undefined): void {
    if (!id) return;

    const confirmed = confirm(`Are you sure you want to delete Order Item #${id}?`);
    if (!confirmed) return;

    this.orderItemService.deleteOrderItem(id).subscribe({
      next: () => {
        this.orderItems = this.orderItems.filter(item => item.id !== id);
        this.cdr.markForCheck();
        alert('Order item deleted successfully!');
      },
      error: (err) => {
        console.error('Error deleting order item:', err);
        alert('Failed to delete order item.');
      }
    });
  }

  get filteredOrderItems(): OrderItem[] {
    const search = this.searchText.toLowerCase().trim();
    if (!search) {
      return this.orderItems;
    }

    return this.orderItems.filter(item =>
      (item.id?.toString() || '').includes(search) ||
      (item.order?.id?.toString() || '').includes(search) ||
      (item.product?.name || '').toLowerCase().includes(search) ||
      (item.quantity?.toString() || '').includes(search) ||
      (item.price?.toString() || '').includes(search)
    );
  }
}
