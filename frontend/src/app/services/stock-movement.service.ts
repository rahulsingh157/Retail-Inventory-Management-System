import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface StockProduct {
  id: number;
  name?: string;
}

export interface StockMovement {
  id?: number;
  product: StockProduct;
  type: string;
  quantity: number;
  reason: string;
  movementDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class StockMovementService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:8080/stock-movements';

  getMovements(): Observable<StockMovement[]> {
    return this.http.get<StockMovement[]>(
      this.apiUrl
    );
  }

  getMovement(id: number): Observable<StockMovement> {
    return this.http.get<StockMovement>(
      `${this.apiUrl}/${id}`
    );
  }

  addMovement(
    movement: StockMovement
  ): Observable<StockMovement> {

    return this.http.post<StockMovement>(
      this.apiUrl,
      movement
    );
  }

  deleteMovement(id: number): Observable<any> {

    return this.http.delete(
      `${this.apiUrl}/${id}`
    );
  }

}