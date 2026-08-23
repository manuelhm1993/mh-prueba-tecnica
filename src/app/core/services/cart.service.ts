import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../models/product.model';
import { CartItem } from '../models/cart.model';

const CART_KEY = 'cart_items';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly itemsSignal = signal<CartItem[]>(this.readCart());

  readonly items = this.itemsSignal.asReadonly();

  readonly totalItems = computed(() =>
    this.itemsSignal().reduce((sum, item) => sum + item.quantity, 0),
  );

  readonly totalPrice = computed(() =>
    this.itemsSignal().reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    ),
  );

  addToCart(product: Product, quantity: number = 1): void {
    const items = this.itemsSignal();
    const existing = items.find((i) => i.product.id === product.id);

    if (existing) {
      this.updateItems(
        items.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + quantity }
            : i,
        ),
      );
    } else {
      this.updateItems([...items, { product, quantity }]);
    }
  }

  increment(productId: number): void {
    this.updateItems(
      this.itemsSignal().map((i) =>
        i.product.id === productId ? { ...i, quantity: i.quantity + 1 } : i,
      ),
    );
  }

  decrement(productId: number): void {
    const items = this.itemsSignal();
    const target = items.find((i) => i.product.id === productId);

    if (target && target.quantity <= 1) {
      this.removeItem(productId);
      return;
    }

    this.updateItems(
      items.map((i) =>
        i.product.id === productId ? { ...i, quantity: i.quantity - 1 } : i,
      ),
    );
  }

  removeItem(productId: number): void {
    this.updateItems(
      this.itemsSignal().filter((i) => i.product.id !== productId),
    );
  }

  clearCart(): void {
    this.updateItems([]);
  }

  private updateItems(items: CartItem[]): void {
    this.itemsSignal.set(items);
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }

  private readCart(): CartItem[] {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  }
}