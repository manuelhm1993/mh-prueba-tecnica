import { Component, signal, OnInit } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';
import { CartService } from '../../../core/services/cart.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-list',
  imports: [RouterLink],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList implements OnInit {
  readonly products = signal<Product[]>([]);
  readonly categories = signal<string[]>([]);
  readonly selectedCategory = signal<string>('all');
  readonly loading = signal(true);
  readonly errorMessage = signal<string | null>(null);

  readonly skeletonItems = Array.from({ length: 8 });

  constructor(
    private productService: ProductService,
    protected cartService: CartService,
  ) {}

  ngOnInit(): void {
    this.productService.getCategories().subscribe({
      next: (cats) => this.categories.set(cats),
      error: () => this.categories.set([]),
    });
    this.loadProducts('all');
  }

  onSelectCategory(category: string): void {
    this.selectedCategory.set(category);
    this.loadProducts(category);
  }

  onAddToCart(product: Product): void {
    this.cartService.addToCart(product);
  }

  private loadProducts(category: string): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    const request$ =
      category === 'all'
        ? this.productService.getProducts()
        : this.productService.getProductsByCategory(category);

    request$.subscribe({
      next: (products) => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('No se pudieron cargar los productos.');
        this.loading.set(false);
      },
    });
  }
}