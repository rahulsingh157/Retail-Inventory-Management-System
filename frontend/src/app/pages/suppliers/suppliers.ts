import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Supplier, SupplierService } from '../../services/supplier.service';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './suppliers.html',
  styleUrl: './suppliers.css'
})
export class Suppliers implements OnInit {

  private supplierService = inject(SupplierService);
  private cdr = inject(ChangeDetectorRef);

  suppliers: Supplier[] = [];
  loading = true;
  showForm = false;
  searchText = '';

  newSupplier: Supplier = {
    name: '',
    companyName: '',
    email: '',
    phone: '',
    address: ''
  };

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers(): void {
    this.loading = true;
    this.cdr.markForCheck();

    this.supplierService.getSuppliers().subscribe({
      next: (data) => {
        this.suppliers = data ?? [];
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading suppliers:', error);
        this.suppliers = [];
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  openForm(): void {
    this.showForm = true;
    this.newSupplier = {
      name: '',
      companyName: '',
      email: '',
      phone: '',
      address: ''
    };
    this.cdr.markForCheck();
  }

  closeForm(): void {
    this.showForm = false;
    this.newSupplier = {
      name: '',
      companyName: '',
      email: '',
      phone: '',
      address: ''
    };
    this.cdr.markForCheck();
  }

  addSupplier(): void {
    if (!this.newSupplier.name.trim() || !this.newSupplier.companyName.trim()) {
      alert('Please enter supplier name and company name.');
      return;
    }

    const supplierToSave: Supplier = {
      name: this.newSupplier.name.trim(),
      companyName: this.newSupplier.companyName.trim(),
      email: this.newSupplier.email.trim(),
      phone: this.newSupplier.phone.trim(),
      address: this.newSupplier.address.trim()
    };

    this.supplierService.addSupplier(supplierToSave).subscribe({
      next: (supplier) => {
        this.showForm = false;
        this.newSupplier = {
          name: '',
          companyName: '',
          email: '',
          phone: '',
          address: ''
        };
        this.loadSuppliers();
        alert('Supplier added successfully!');
      },
      error: (error) => {
        console.error('Error adding supplier:', error);
        alert('Failed to add supplier.\n\nStatus: ' + error.status);
      }
    });
  }

  deleteSupplier(id: number | undefined): void {
    if (!id) return;

    const confirmed = confirm('Are you sure you want to delete this supplier?');
    if (!confirmed) return;

    this.supplierService.deleteSupplier(id).subscribe({
      next: () => {
        this.suppliers = this.suppliers.filter(supplier => supplier.id !== id);
        this.cdr.markForCheck();
        alert('Supplier deleted successfully!');
      },
      error: (error) => {
        console.error('Error deleting supplier:', error);
        alert('Failed to delete supplier.');
      }
    });
  }

  get filteredSuppliers(): Supplier[] {
    const search = this.searchText.toLowerCase().trim();
    if (!search) {
      return this.suppliers;
    }

    return this.suppliers.filter(supplier =>
      (supplier.name || '').toLowerCase().includes(search) ||
      (supplier.companyName || '').toLowerCase().includes(search) ||
      (supplier.email || '').toLowerCase().includes(search) ||
      (supplier.phone || '').toLowerCase().includes(search)
    );
  }
}