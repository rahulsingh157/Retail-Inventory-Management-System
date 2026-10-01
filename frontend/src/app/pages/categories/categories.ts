import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Category, CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './categories.html',
  styleUrl: './categories.css'
})
export class Categories implements OnInit {

  private categoryService = inject(CategoryService);
  private cdr = inject(ChangeDetectorRef);

  categories: Category[] = [];
  loading = true;
  showForm = false;
  searchText = '';

  newCategory: Category = {
    name: '',
    description: ''
  };

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.cdr.markForCheck();

    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data ?? [];
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.categories = [];
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  openForm(): void {
    this.showForm = true;
    this.newCategory = {
      name: '',
      description: ''
    };
    this.cdr.markForCheck();
  }

  closeForm(): void {
    this.showForm = false;
    this.newCategory = {
      name: '',
      description: ''
    };
    this.cdr.markForCheck();
  }

  addCategory(): void {
    if (!this.newCategory.name.trim()) {
      alert('Please enter category name.');
      return;
    }

    const categoryToSave: Category = {
      name: this.newCategory.name.trim(),
      description: this.newCategory.description.trim()
    };

    this.categoryService.addCategory(categoryToSave).subscribe({
      next: (category) => {
        this.showForm = false;
        this.newCategory = {
          name: '',
          description: ''
        };
        this.loadCategories();
        alert('Category added successfully!');
      },
      error: (error) => {
        console.error('Error adding category:', error);
        alert('Failed to add category.\n\nStatus: ' + error.status);
      }
    });
  }

  deleteCategory(id: number | undefined): void {
    if (!id) return;

    const confirmed = confirm('Are you sure you want to delete this category?');
    if (!confirmed) return;

    this.categoryService.deleteCategory(id).subscribe({
      next: () => {
        this.categories = this.categories.filter(category => category.id !== id);
        this.cdr.markForCheck();
        alert('Category deleted successfully!');
      },
      error: (error) => {
        console.error('Error deleting category:', error);
        alert('Failed to delete category.');
      }
    });
  }

  get filteredCategories(): Category[] {
    const search = this.searchText.toLowerCase().trim();
    if (!search) {
      return this.categories;
    }

    return this.categories.filter(category =>
      category.name.toLowerCase().includes(search) ||
      (category.description || '').toLowerCase().includes(search)
    );
  }
}