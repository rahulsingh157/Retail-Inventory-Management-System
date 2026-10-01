import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { StockMovement, StockMovementService } from '../../services/stock-movement.service';
import { Product, ProductService } from '../../services/product.service';

@Component({
  selector: 'app-stock-movements',
  imports: [FormsModule, DatePipe],
  templateUrl: './stock-movements.html',
  styleUrl: './stock-movements.css'
})
export class StockMovements implements OnInit {

  private movementService = inject(StockMovementService);
  private productService = inject(ProductService);
  private cdr = inject(ChangeDetectorRef);

  movements: StockMovement[] = [];
  products: Product[] = [];
  loading = true;
  showForm = false;
  searchText = '';

  newMovement: StockMovement = {
    product: { id: 0 },
    type: 'IN',
    quantity: 0,
    reason: '',
    movementDate: this.getCurrentDateTime()
  };

  ngOnInit(): void {
    this.loadMovements();
    this.loadProducts();
  }

  getCurrentDateTime(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  loadMovements(): void {
    this.loading = true;
    this.cdr.markForCheck();

    this.movementService.getMovements().subscribe({
      next: (data) => {
        this.movements = data ?? [];
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading stock movements:', error);
        this.movements = [];
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data ?? [];
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.products = [];
        this.cdr.markForCheck();
      }
    });
  }

  openForm(): void {
    this.showForm = true;
    this.newMovement = {
      product: {
        id: this.products.length > 0 ? this.products[0].id! : 0
      },
      type: 'IN',
      quantity: 0,
      reason: '',
      movementDate: this.getCurrentDateTime()
    };
    this.cdr.markForCheck();
  }

  closeForm(): void {
    this.showForm = false;
    this.cdr.markForCheck();
  }

  addMovement(): void {
    if (!this.newMovement.product.id || this.newMovement.product.id <= 0) {
      alert('Please select a product.');
      return;
    }

    if (!this.newMovement.quantity || this.newMovement.quantity <= 0) {
      alert('Please enter a valid quantity.');
      return;
    }

    if (!this.newMovement.reason.trim()) {
      alert('Please enter a reason.');
      return;
    }

    const movementToSave: StockMovement = {
      product: { id: Number(this.newMovement.product.id) },
      type: this.newMovement.type,
      quantity: Number(this.newMovement.quantity),
      reason: this.newMovement.reason.trim(),
      movementDate: this.newMovement.movementDate
    };

    this.movementService.addMovement(movementToSave).subscribe({
      next: (movement) => {
        this.showForm = false;
        this.loadMovements();
        alert('Stock movement added successfully!');
      },
      error: (error) => {
        console.error('Error adding movement:', error);
        const errorMessage = error.error?.message || ('Status: ' + error.status);
        alert('Failed to add stock movement.\n\n' + errorMessage);
      }
    });
  }

  deleteMovement(id: number | undefined): void {
    if (!id) return;

    const confirmed = confirm('Are you sure you want to delete this stock movement?');
    if (!confirmed) return;

    this.movementService.deleteMovement(id).subscribe({
      next: () => {
        this.movements = this.movements.filter(movement => movement.id !== id);
        this.cdr.markForCheck();
        alert('Stock movement deleted successfully!');
      },
      error: (error) => {
        console.error('Error deleting movement:', error);
        alert('Failed to delete stock movement.');
      }
    });
  }

  getProductName(productId: number | undefined): string {
    if (!productId) return 'Unknown Product';
    const product = this.products.find(p => p.id === productId);
    return product?.name ?? `Product #${productId}`;
  }

  get filteredMovements(): StockMovement[] {
    const search = this.searchText.toLowerCase().trim();
    if (!search) {
      return this.movements;
    }

    return this.movements.filter(movement => {
      const productName = this.getProductName(movement.product?.id);
      return (
        productName.toLowerCase().includes(search) ||
        (movement.type || '').toLowerCase().includes(search) ||
        (movement.reason || '').toLowerCase().includes(search)
      );
    });
  }
}