import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product, ProductService } from '../../services/product.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products implements OnInit {

  private productService = inject(ProductService);
  private cdr = inject(ChangeDetectorRef);

  products: Product[] = [];
  loading = true;
  showForm = false;
  searchText = '';

  newProduct: Product = {
    name: '',
    description: '',
    category: '',
    quantity: 0
  };

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.cdr.markForCheck();

    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data ?? [];
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.products = [];
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  openForm(): void {
    this.showForm = true;
    this.newProduct = {
      name: '',
      description: '',
      category: '',
      quantity: 0
    };
    this.cdr.markForCheck();
  }

  closeForm(): void {
    this.showForm = false;
    this.newProduct = {
      name: '',
      description: '',
      category: '',
      quantity: 0
    };
    this.cdr.markForCheck();
  }

  addProduct(): void {
    if (!this.newProduct.name.trim() || !this.newProduct.category.trim()) {
      alert('Please enter product name and category.');
      return;
    }

    const productToSave: Product = {
      name: this.newProduct.name.trim(),
      description: this.newProduct.description.trim(),
      category: this.newProduct.category.trim(),
      quantity: Number(this.newProduct.quantity)
    };

    this.productService.addProduct(productToSave).subscribe({
      next: (savedProduct) => {
        this.showForm = false;
        this.newProduct = {
          name: '',
          description: '',
          category: '',
          quantity: 0
        };
        this.loadProducts();
        alert('Product added successfully!');
      },
      error: (error) => {
        console.error('Error adding product:', error);
        alert('Failed to add product.\n\nStatus: ' + error.status);
      }
    });
  }

  deleteProduct(id: number | undefined): void {
    if (!id) return;

    const confirmed = confirm('Are you sure you want to delete this product?');
    if (!confirmed) return;

    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.products = this.products.filter(product => product.id !== id);
        this.cdr.markForCheck();
        alert('Product deleted successfully!');
      },
      error: (error) => {
        console.error('Error deleting product:', error);
        alert('Failed to delete product.');
      }
    });
  }

  get filteredProducts(): Product[] {
    const search = this.searchText.toLowerCase().trim();
    if (!search) {
      return this.products;
    }

    return this.products.filter(product =>
      product.name.toLowerCase().includes(search) ||
      product.category.toLowerCase().includes(search) ||
      (product.description || '').toLowerCase().includes(search)
    );
  }
}