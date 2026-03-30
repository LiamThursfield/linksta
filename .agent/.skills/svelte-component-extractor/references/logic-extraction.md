# Logic Extraction Patterns

How to extract business logic, fetch code, and shared state out of `.svelte` files.

---

## When to Extract Logic

Extract logic out of a `.svelte` file when:
- The same fetch/store pattern exists in 2+ components
- A component's `<script>` block is longer than ~40 lines of non-UI logic
- Business rules (filtering, transforming, validating) are mixed with rendering
- State needs to survive navigation or be shared across unrelated components

Leave logic inline when:
- It's genuinely local to one component and won't be reused
- It's simple event handling (`let open = false; function toggle() { open = !open }`)

---

## Pattern 1: Fetch Logic → API Module

**Before** (repeated in multiple `.svelte` files):
```svelte
<script>
  let products = [];
  let loading = true;
  let error = null;

  onMount(async () => {
    try {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Failed to load');
      products = await res.json();
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  });
</script>
```

**After** — `src/lib/api/products.ts`:
```typescript
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
}

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch('/api/products');
  if (!res.ok) throw new Error(`Failed to load products: ${res.status}`);
  return res.json();
}

export async function fetchProduct(id: string): Promise<Product> {
  const res = await fetch(`/api/products/${id}`);
  if (!res.ok) throw new Error(`Product not found: ${id}`);
  return res.json();
}
```

**After** — component now:
```svelte
<script>
  import { fetchProducts } from '$lib/api/products';
  
  let products = [];
  let loading = true;
  let error = null;

  onMount(async () => {
    try { products = await fetchProducts(); }
    catch (e) { error = e.message; }
    finally { loading = false; }
  });
</script>
```

If loading/error is *also* shared, move to a store (Pattern 2).

---

## Pattern 2: Shared Async State → Svelte Store (Svelte 4 / compatible with 5)

**`src/lib/stores/products.ts`**:
```typescript
import { writable, derived } from 'svelte/store';
import { fetchProducts, type Product } from '$lib/api/products';

// Internal state
const _products = writable<Product[]>([]);
const _loading = writable(false);
const _error = writable<string | null>(null);

// Public readable interface
export const products = { subscribe: _products.subscribe };
export const productsLoading = { subscribe: _loading.subscribe };
export const productsError = { subscribe: _error.subscribe };

// Derived convenience
export const productCount = derived(_products, $p => $p.length);

// Action
export async function loadProducts() {
  _loading.set(true);
  _error.set(null);
  try {
    const data = await fetchProducts();
    _products.set(data);
  } catch (e) {
    _error.set(e instanceof Error ? e.message : 'Unknown error');
  } finally {
    _loading.set(false);
  }
}
```

**Component** (Svelte 4):
```svelte
<script>
  import { products, productsLoading, productsError, loadProducts } from '$lib/stores/products';
  import { onMount } from 'svelte';
  onMount(loadProducts);
</script>

{#if $productsLoading}<Spinner />{/if}
{#if $productsError}<ErrorBanner message={$productsError} />{/if}
{#each $products as product}
  <ProductCard {...product} />
{/each}
```

---

## Pattern 3: Shared State → Svelte 5 Universal Store (`.svelte.ts`)

Svelte 5 supports reactive state in `.svelte.ts` files using runes — no need for the `writable`/`readable` API:

**`src/lib/stores/products.svelte.ts`**:
```typescript
import { fetchProducts, type Product } from '$lib/api/products';

// This file uses Svelte 5 runes — only importable in .svelte or .svelte.ts files
let products = $state<Product[]>([]);
let loading = $state(false);
let error = $state<string | null>(null);

export function useProducts() {
  return {
    get products() { return products; },
    get loading() { return loading; },
    get error() { return error; },
    async load() {
      loading = true;
      error = null;
      try {
        products = await fetchProducts();
      } catch (e) {
        error = e instanceof Error ? e.message : 'Unknown error';
      } finally {
        loading = false;
      }
    }
  };
}
```

**Component** (Svelte 5):
```svelte
<script>
  import { useProducts } from '$lib/stores/products.svelte';
  import { onMount } from 'svelte';

  const store = useProducts();
  onMount(store.load);
</script>

{#if store.loading}<Spinner />{/if}
{#if store.error}<ErrorBanner message={store.error} />{/if}
{#each store.products as product}
  <ProductCard {...product} />
{/each}
```

---

## Pattern 4: Business Logic → Utility Module

Transform/filter/validate logic does not belong in `.svelte` files.

**Before** (inline in component):
```svelte
<script>
  $: sortedProducts = products
    .filter(p => p.inStock && p.price <= maxPrice)
    .sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
</script>
```

**After** — `src/lib/utils/products.ts`:
```typescript
import type { Product } from '$lib/api/products';

export type SortKey = 'price' | 'name' | 'default';

export function filterAndSort(
  products: Product[],
  { maxPrice, inStock, sortBy }: { maxPrice?: number; inStock?: boolean; sortBy?: SortKey }
): Product[] {
  let result = [...products];
  if (inStock) result = result.filter(p => p.inStock);
  if (maxPrice != null) result = result.filter(p => p.price <= maxPrice);
  if (sortBy === 'price') result.sort((a, b) => a.price - b.price);
  if (sortBy === 'name') result.sort((a, b) => a.name.localeCompare(b.name));
  return result;
}
```

**Component** (Svelte 4):
```svelte
<script>
  import { filterAndSort } from '$lib/utils/products';
  $: sortedProducts = filterAndSort(products, { maxPrice, inStock: true, sortBy });
</script>
```

**Component** (Svelte 5):
```svelte
<script>
  import { filterAndSort } from '$lib/utils/products';
  let sortedProducts = $derived(filterAndSort(products, { maxPrice, inStock: true, sortBy }));
</script>
```

---

## File Location Convention

```
src/lib/
├── api/          ← raw fetch functions, typed responses
│   ├── products.ts
│   └── users.ts
├── stores/       ← shared reactive state (writable stores or .svelte.ts)
│   ├── cart.ts
│   └── products.svelte.ts   ← Svelte 5 universal store
├── utils/        ← pure functions: transform, filter, validate, format
│   ├── products.ts
│   └── currency.ts
└── components/   ← .svelte UI components
```

---

## What Stays in the `.svelte` File

After logic extraction, a `.svelte` file should only contain:
- Component-local UI state (toggle open/closed, hover, focus)
- Imports of stores/utils/api functions
- Simple event handlers that call imported functions
- Template markup and bindings
- Scoped styles

If the `<script>` block still has complex conditionals, data transformation, or inline fetch calls after extraction — there's more to move out.