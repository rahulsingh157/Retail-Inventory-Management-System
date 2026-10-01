import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SalesOrder } from './order.service';
import { Product } from './product.service';

export interface OrderItem {
  id?: number;
  order?: SalesOrder | null;
  product?: Product | null;
  quantity: number;
  price: number;
  totalPrice?: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrderItemService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/order-items';

  getOrderItems(): Observable<OrderItem[]> {
    return this.http.get<OrderItem[]>(this.apiUrl);
  }

  getOrderItem(id: number): Observable<OrderItem> {
    return this.http.get<OrderItem>(`${this.apiUrl}/${id}`);
  }

  addOrderItem(item: OrderItem): Observable<OrderItem> {
    return this.http.post<OrderItem>(this.apiUrl, item);
  }

  deleteOrderItem(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' as 'json' });
  }
}
