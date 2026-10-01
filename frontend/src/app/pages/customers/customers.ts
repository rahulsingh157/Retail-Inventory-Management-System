import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Customer, CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './customers.html',
  styleUrl: './customers.css'
})
export class Customers implements OnInit {

  private customerService = inject(CustomerService);
  private cdr = inject(ChangeDetectorRef);

  customers: Customer[] = [];
  loading = true;
  showForm = false;
  searchText = '';

  newCustomer: Customer = {
    name: '',
    email: '',
    phone: '',
    address: ''
  };

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.loading = true;
    this.cdr.markForCheck();

    this.customerService.getCustomers().subscribe({
      next: (data) => {
        this.customers = data ?? [];
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading customers:', error);
        this.customers = [];
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  openForm(): void {
    this.showForm = true;
    this.newCustomer = {
      name: '',
      email: '',
      phone: '',
      address: ''
    };
    this.cdr.markForCheck();
  }

  closeForm(): void {
    this.showForm = false;
    this.newCustomer = {
      name: '',
      email: '',
      phone: '',
      address: ''
    };
    this.cdr.markForCheck();
  }

  addCustomer(): void {
    if (!this.newCustomer.name.trim()) {
      alert('Please enter customer name.');
      return;
    }

    const customerToSave: Customer = {
      name: this.newCustomer.name.trim(),
      email: this.newCustomer.email.trim(),
      phone: this.newCustomer.phone.trim(),
      address: this.newCustomer.address.trim()
    };

    this.customerService.addCustomer(customerToSave).subscribe({
      next: (customer) => {
        this.showForm = false;
        this.newCustomer = {
          name: '',
          email: '',
          phone: '',
          address: ''
        };
        this.loadCustomers();
        alert('Customer added successfully!');
      },
      error: (error) => {
        console.error('Error adding customer:', error);
        alert('Failed to add customer.\n\nStatus: ' + error.status);
      }
    });
  }

  deleteCustomer(id: number | undefined): void {
    if (!id) return;

    const confirmed = confirm('Are you sure you want to delete this customer?');
    if (!confirmed) return;

    this.customerService.deleteCustomer(id).subscribe({
      next: () => {
        this.customers = this.customers.filter(customer => customer.id !== id);
        this.cdr.markForCheck();
        alert('Customer deleted successfully!');
      },
      error: (error) => {
        console.error('Error deleting customer:', error);
        alert('Failed to delete customer.');
      }
    });
  }

  get filteredCustomers(): Customer[] {
    const search = this.searchText.toLowerCase().trim();
    if (!search) {
      return this.customers;
    }

    return this.customers.filter(customer =>
      (customer.name || '').toLowerCase().includes(search) ||
      (customer.email || '').toLowerCase().includes(search) ||
      (customer.phone || '').toLowerCase().includes(search) ||
      (customer.address || '').toLowerCase().includes(search)
    );
  }
}