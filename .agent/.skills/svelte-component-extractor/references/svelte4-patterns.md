# Svelte 4 Component Patterns

Best practices for components in Svelte 4 (pre-runes).

---

## Component Anatomy

```svelte
<script>
  // 1. External imports
  import { createEventDispatcher, onMount } from 'svelte';
  import SomeChild from './SomeChild.svelte';

  // 2. Dispatcher (if component emits custom events)
  const dispatch = createEventDispatcher();

  // 3. Props (exported, with defaults)
  export let title = '';
  export let variant = 'default'; // 'default' | 'outlined' | 'ghost'
  export let disabled = false;
  export let className = '';

  // 4. Internal reactive state
  let open = false;
  $: isActive = !disabled && open;

  // 5. Functions
  function handleClick(event) {
    if (disabled) return;
    open = !open;
    dispatch('toggle', { open });
  }
</script>

<!-- Template -->
<div 
  class="component {variant} {className}"
  class:disabled
  role="button"
  tabindex={disabled ? -1 : 0}
  on:click={handleClick}
  on:keydown={(e) => e.key === 'Enter' && handleClick(e)}
  {...$$restProps}
>
  <slot />
</div>

<style>
  .component { /* base styles */ }
  .component.disabled { pointer-events: none; opacity: 0.5; }
</style>
```

---

## Props

### Basic typed props
```svelte
<script>
  /** @type {string} */
  export let label;

  /** @type {'sm' | 'md' | 'lg'} */
  export let size = 'md';

  /** @type {() => void} */
  export let onClick = undefined;
</script>
```

### Optional props with defaults
Always give optional props a default so the component works without them:
```svelte
export let href = undefined;  // undefined means "not provided"
export let icon = null;
export let count = 0;
```

### Spread unknown attributes (`$$restProps`)
Use to allow consumers to pass HTML attributes through to the root element:
```svelte
<button class="btn {className}" {...$$restProps}>
  <slot />
</button>
```
This lets callers use `<Button aria-label="close" data-testid="btn" />` without explicitly forwarding each attribute.

---

## Events

### Dispatch custom events
```svelte
<script>
  const dispatch = createEventDispatcher();

  function handleSelect(item) {
    dispatch('select', { item }); // parent listens with on:select
  }
</script>
```

### Forward DOM events
Add `on:click` etc. **without** a handler to bubble the DOM event upward:
```svelte
<button on:click on:keydown on:focus on:blur>
  <slot />
</button>
```
This is important for wrapper components that should be transparent to event listeners.

---

## Slots

### Default slot
```svelte
<div class="card">
  <slot />  <!-- <Card>content here</Card> -->
</div>
```

### Named slots
```svelte
<div class="card">
  <header><slot name="header" /></header>
  <div class="body"><slot /></div>
  <footer><slot name="footer" /></footer>
</div>
```

### Slot with fallback content
```svelte
<slot name="empty">
  <p class="empty-state">No items found.</p>
</slot>
```

### Let directives (passing data to slot)
```svelte
<!-- Component -->
<script>
  export let items = [];
</script>

{#each items as item}
  <slot {item} index={i} />
{/each}
```
```svelte
<!-- Parent -->
<List {items} let:item let:index>
  <span>{index + 1}. {item.name}</span>
</List>
```

---

## Reactive Declarations

```svelte
<script>
  export let items = [];
  export let filter = '';

  // Derived value — recalculates when dependencies change
  $: filteredItems = items.filter(i => 
    i.name.toLowerCase().includes(filter.toLowerCase())
  );

  // Reactive statement — runs as a side effect
  $: if (filteredItems.length === 0) {
    console.warn('No results for filter:', filter);
  }
</script>
```

---

## Stores (when to use)

Stores are for **shared global/cross-component state**. Don't use stores for:
- Data that only one component needs → use local state
- Data passed parent → child → use props
- Data passed child → parent → use events

Appropriate store uses:
- Auth/user session
- Theme / dark mode
- Cart / global app state
- Notification/toast queue

### Passing store value as prop (preferred for presentational components)
```svelte
<!-- Parent: subscribes and passes value down -->
<script>
  import { cartStore } from '$lib/stores/cart';
</script>
<CartCount count={$cartStore.items.length} />

<!-- CartCount.svelte: pure presentational, no store dependency -->
<script>
  export let count = 0;
</script>
<span>{count}</span>
```

---

## Lifecycle

```svelte
<script>
  import { onMount, onDestroy, beforeUpdate, afterUpdate, tick } from 'svelte';

  let element;

  onMount(() => {
    // DOM is available here
    // Return a cleanup function if needed
    const handler = () => {};
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  });
</script>

<div bind:this={element} />
```

---

## Transitions & Animations

Svelte 4 transitions are built-in and component-scoped:
```svelte
<script>
  import { fade, fly, slide } from 'svelte/transition';
</script>

{#if visible}
  <div transition:fade={{ duration: 200 }}>
    Content
  </div>
{/if}
```

When extracting components, move `transition:` directives into the child component rather than applying them from the parent, unless the parent controls show/hide.

---

## Common Extensibility Patterns

### Variant prop
```svelte
<script>
  export let variant = 'primary'; // 'primary' | 'secondary' | 'danger'
  export let size = 'md'; // 'sm' | 'md' | 'lg'
</script>

<button class="btn btn--{variant} btn--{size}">
  <slot />
</button>
```

### Class forwarding
```svelte
<script>
  let { class: className = '', ...rest } = $$props; 
  // Note: in Svelte 4, $$props is an object of ALL props including class
</script>
<div class="base {className}" {...$$restProps}>...</div>
```

### Polymorphic element (`as` prop)
```svelte
<script>
  export let as = 'div';
</script>
<svelte:element this={as} class="wrapper">
  <slot />
</svelte:element>
```
This lets `<Wrapper as="section">` or `<Wrapper as="article">` change the HTML element.