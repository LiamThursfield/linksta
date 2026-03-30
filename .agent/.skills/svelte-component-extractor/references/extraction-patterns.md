# Extraction Patterns Reference

Concrete heuristics and worked examples for deciding what to extract and how.

---

## Pattern 1: Repeated {#each} Item

**Signal**: A `{#each}` loop with more than ~8 lines of markup per item.

**Before** (`+page.svelte`):
```svelte
{#each products as product}
  <div class="card">
    <img src={product.image} alt={product.name} />
    <h2>{product.name}</h2>
    <p>{product.description}</p>
    <span class="price">${product.price}</span>
    <button on:click={() => addToCart(product)}>Add to cart</button>
  </div>
{/each}
```

**After** — extract to `ProductCard.svelte`:
```svelte
<!-- ProductCard.svelte -->
<script>
  export let name;
  export let description;
  export let price;
  export let image;
  export let className = '';
</script>

<div class="card {className}">
  <img src={image} alt={name} />
  <h2>{name}</h2>
  <p>{description}</p>
  <span class="price">${price}</span>
  <slot name="actions">
    <!-- default slot allows parent to inject custom actions -->
  </slot>
</div>
```

```svelte
<!-- +page.svelte -->
<script>
  import ProductCard from '$lib/components/ProductCard.svelte';
</script>

{#each products as product}
  <ProductCard {...product}>
    <svelte:fragment slot="actions">
      <button on:click={() => addToCart(product)}>Add to cart</button>
    </svelte:fragment>
  </ProductCard>
{/each}
```

Note: The button was put in a slot because the action (addToCart) belongs to the parent's scope.

---

## Pattern 2: Layout Section

**Signal**: A clearly named section (header, nav, footer, sidebar) inline in a page or layout file.

**Before** (`+layout.svelte`):
```svelte
<header>
  <a href="/">
    <img src="/logo.svg" alt="Logo" class="logo" />
  </a>
  <nav>
    {#each navLinks as link}
      <a href={link.href} class:active={$page.url.pathname === link.href}>
        {link.label}
      </a>
    {/each}
  </nav>
  <button class="theme-toggle" on:click={toggleTheme}>...</button>
</header>
```

**After** — `SiteHeader.svelte`:
- Move the entire `<header>` block into the component
- The nav links can be a prop (`export let links = []`) or passed as a slot
- `$page` store can be imported directly here since it's navigation logic, not business data
- The theme toggle dispatches an event upward or calls a passed callback

---

## Pattern 3: Form Field Group

**Signal**: `<label>` + `<input>` (or `<select>`, `<textarea>`) grouped together, repeated multiple times in a form.

**Before**:
```svelte
<div class="field">
  <label for="email">Email</label>
  <input id="email" type="email" bind:value={email} />
  {#if errors.email}<span class="error">{errors.email}</span>{/if}
</div>

<div class="field">
  <label for="name">Name</label>
  <input id="name" type="text" bind:value={name} />
  {#if errors.name}<span class="error">{errors.name}</span>{/if}
</div>
```

**After** — `FormField.svelte`:
```svelte
<script>
  export let label;
  export let id;
  export let type = 'text';
  export let value = '';
  export let error = '';
  export let className = '';
</script>

<div class="field {className}">
  <label for={id}>{label}</label>
  <input {id} {type} bind:value on:input on:change on:blur />
  {#if error}<span class="error">{error}</span>{/if}
</div>
```

Note: `bind:value` on an `export let` prop enables two-way binding from the parent. Event forwarding (`on:input` etc. without handlers) passes the DOM events up.

---

## Pattern 4: Async Data Block

**Signal**: The same `loading` / `error` / `data` pattern appearing in multiple components.

**Before** (repeated in multiple pages):
```svelte
<script>
  let data = null, loading = true, error = null;
  onMount(async () => {
    try {
      data = await fetchSomething();
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  });
</script>

{#if loading}<Spinner />{/if}
{#if error}<ErrorMessage {error} />{/if}
{#if data}...{/if}
```

**After** — `AsyncLoader.svelte` (Svelte 4):
```svelte
<script>
  export let load; // async function
  
  let data = null, loading = true, error = null;
  onMount(async () => {
    try { data = await load(); }
    catch (e) { error = e.message; }
    finally { loading = false; }
  });
</script>

{#if loading}<slot name="loading"><Spinner /></slot>{/if}
{#if error}<slot name="error" {error}><ErrorMessage {error} /></slot>{/if}
{#if data}<slot {data} />{/if}
```

Usage:
```svelte
<AsyncLoader load={fetchProducts}>
  <svelte:fragment slot="default" let:data>
    {#each data as product}...{/each}
  </svelte:fragment>
</AsyncLoader>
```

---

## Pattern 5: Icon Abstraction

**Signal**: Inline `<svg>` elements repeated, or different icons with the same wrapper styles.

**After** — `Icon.svelte`:
```svelte
<script>
  export let name; // maps to a dynamic import or icon set
  export let size = 24;
  export let color = 'currentColor';
  export let className = '';
  export let label = ''; // for aria-label
</script>

<span 
  class="icon {className}" 
  aria-label={label || undefined}
  role={label ? 'img' : undefined}
  style="width: {size}px; height: {size}px; color: {color}"
>
  <slot /> <!-- caller injects the actual <svg> -->
</span>
```

---

## When NOT to Extract

- A block used exactly once with no realistic reuse scenario
- A block where the parent's reactive variables are so deeply entangled that props/events would be more complex than the original
- Very short blocks (< 5 lines) that don't have a clear conceptual identity
- Blocks that are already inside a component that's the right size

---

## Naming Guide

| Pattern | Suggested naming |
|---------|-----------------|
| Item in a list | Entity + "Card" or "Item" — `ProductCard`, `UserItem` |
| Page section | Semantic name — `SiteHeader`, `SiteFooter`, `HeroSection` |
| Form primitive | "Form" + element — `FormField`, `FormSelect`, `FormCheckbox` |
| Layout wrapper | "Layout" prefix or descriptive — `TwoColumnLayout`, `PageShell` |
| UI primitive | Plain name — `Button`, `Badge`, `Avatar`, `Modal` |
| Data container | Entity + "List" — `ProductList`, `CommentFeed` |