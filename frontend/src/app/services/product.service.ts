import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id?: number;
  name: string;
  description: string;
  category: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:8080/products';

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(
      `${this.apiUrl}/${id}`
    );
  }

  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(
      this.apiUrl,
      product
    );
  }

  deleteProduct(id: number): Observable<string> {
    return this.http.delete<string>(
      `${this.apiUrl}/${id}`
    );
  }
}