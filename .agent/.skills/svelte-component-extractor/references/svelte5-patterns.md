# Svelte 5 Component Patterns (Runes)

Best practices for components using Svelte 5's runes API.

---

## Component Anatomy

```svelte
<script>
  // 1. External imports (no need to import lifecycle fns from 'svelte' for most cases)
  import SomeChild from './SomeChild.svelte';

  // 2. Props via $props()
  let {
    title = '',
    variant = 'default',
    disabled = false,
    class: className = '',
    onclick,          // callback prop (replaces createEventDispatcher)
    children,         // snippet prop (replaces default slot)
    ...rest           // rest props for spreading onto root element
  } = $props();

  // 3. Local reactive state via $state()
  let open = $state(false);

  // 4. Derived values via $derived()
  let isActive = $derived(!disabled && open);

  // 5. Side effects via $effect()
  $effect(() => {
    if (open) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; }; // cleanup
  });

  // 6. Functions
  function handleClick(event) {
    if (disabled) return;
    open = !open;
    onclick?.({ open });
  }
</script>

<div
  class="component {variant} {className}"
  class:disabled
  role="button"
  tabindex={disabled ? -1 : 0}
  onclick={handleClick}
  onkeydown={(e) => e.key === 'Enter' && handleClick(e)}
  {...rest}
>
  {@render children?.()}
</div>

<style>
  .component { /* base styles */ }
  .component.disabled { pointer-events: none; opacity: 0.5; }
</style>
```

---

## $props()

Svelte 5 replaces `export let` with `$props()`:

```svelte
<script>
  let {
    label,                    // required prop (no default)
    size = 'md',              // optional with default
    href = undefined,         // optional, undefined = not provided
    disabled = false,
    class: className = '',    // 'class' is reserved, rename via destructuring
    children,                 // default snippet (replaces <slot />)
    header,                   // named snippet (replaces <slot name="header" />)
    onselect,                 // callback prop (replaces dispatch('select'))
    ...rest                   // rest props — spread onto root element
  } = $props();
</script>
```

**Important**: Unlike `$$restProps` in Svelte 4, `...rest` only captures props not explicitly destructured. Explicitly destructure everything you use.

---

## $state()

```svelte
<script>
  let count = $state(0);
  let items = $state([]);        // arrays/objects are deeply reactive
  let open = $state(false);

  // For complex objects
  let form = $state({ name: '', email: '', errors: {} });
  form.name = 'Alice'; // reactive — no need for reassignment
</script>
```

### $state.raw() — opt out of deep reactivity
```svelte
let largeDataset = $state.raw([]); // won't make nested objects reactive
```

---

## $derived()

Replaces `$:` reactive declarations:

```svelte
<script>
  let items = $state([]);
  let filter = $state('');

  // Simple derived
  let count = $derived(items.length);

  // Complex derived (use $derived.by for multi-line)
  let filteredItems = $derived.by(() => {
    if (!filter) return items;
    return items.filter(i => 
      i.name.toLowerCase().includes(filter.toLowerCase())
    );
  });
</script>
```

---

## $effect()

Replaces `onMount` for most side effects:

```svelte
<script>
  let element = $state(null); // bind:this target

  $effect(() => {
    if (!element) return;
    const observer = new ResizeObserver(() => { /* ... */ });
    observer.observe(element);
    return () => observer.disconnect(); // cleanup runs on destroy or re-run
  });
</script>

<div bind:this={element} />
```

For one-time setup that should only run once, use `$effect` — but note it tracks reactive dependencies and re-runs if they change. To intentionally ignore a dependency, use `untrack()`:

```svelte
import { untrack } from 'svelte';

$effect(() => {
  // Runs when `trigger` changes, but doesn't re-run when `someValue` changes
  console.log(trigger);
  untrack(() => console.log(someValue));
});
```

---

## Snippets (replaces Slots)

### Defining snippet props
```svelte
<script>
  let { children, header, footer } = $props();
</script>

<div class="card">
  {#if header}
    <header>{@render header()}</header>
  {/if}
  <div class="body">{@render children?.()}</div>
  {#if footer}
    <footer>{@render footer()}</footer>
  {/if}
</div>
```

### Calling a component with snippets
```svelte
<Card>
  {#snippet header()}
    <h2>Card Title</h2>
  {/snippet}

  <p>Default content goes here</p>

  {#snippet footer()}
    <button>Action</button>
  {/snippet}
</Card>
```

### Snippets with parameters (replaces `let:` directives)
```svelte
<!-- Component -->
<script>
  let { items, row } = $props();
</script>

{#each items as item, i}
  {@render row(item, i)}
{/each}
```

```svelte
<!-- Parent -->
<List {items}>
  {#snippet row(item, index)}
    <span>{index + 1}. {item.name}</span>
  {/snippet}
</List>
```

---

## Callback Props (replaces createEventDispatcher)

Svelte 5 prefers callback props over custom events:

```svelte
<!-- Component -->
<script>
  let { onselect, onclose } = $props();
</script>

<button onclick={() => onselect?.({ value: 'foo' })}>Select</button>
<button onclick={() => onclose?.()}>Close</button>
```

```svelte
<!-- Parent -->
<Picker onselect={(e) => handleSelect(e.value)} onclose={handleClose} />
```

For DOM event forwarding, use `...rest` spread and include event handlers in it, or explicitly forward:
```svelte
<button onclick={rest.onclick} {...rest}>
  {@render children?.()}
</button>
```

---

## Bindable Props ($bindable)

For two-way binding (e.g. form inputs):
```svelte
<script>
  let { value = $bindable('') } = $props();
</script>

<input bind:value />
```

```svelte
<!-- Parent -->
<TextInput bind:value={username} />
```

Use `$bindable` sparingly — prefer callback props for most interactions.

---

## Extensibility Patterns

### Class forwarding
```svelte
<script>
  let { class: className = '', children, ...rest } = $props();
</script>

<div class="base-styles {className}" {...rest}>
  {@render children?.()}
</div>
```

### Polymorphic element
```svelte
<script>
  let { as: Tag = 'div', children, class: className = '', ...rest } = $props();
</script>

<Tag class="wrapper {className}" {...rest}>
  {@render children?.()}
</Tag>
```

### Variant + size system
```svelte
<script>
  let {
    variant = 'primary',  // 'primary' | 'secondary' | 'ghost' | 'danger'
    size = 'md',          // 'sm' | 'md' | 'lg'
    class: className = '',
    children,
    ...rest
  } = $props();
</script>

<button class="btn btn-{variant} btn-{size} {className}" {...rest}>
  {@render children?.()}
</button>
```

---

## Migration Notes (Svelte 4 → 5)

| Svelte 4 | Svelte 5 |
|----------|----------|
| `export let x = 'default'` | `let { x = 'default' } = $props()` |
| `let count = 0` (reactive via `$:`) | `let count = $state(0)` |
| `$: doubled = count * 2` | `let doubled = $derived(count * 2)` |
| `onMount(() => { ... })` | `$effect(() => { ... })` |
| `createEventDispatcher()` + `dispatch('name', data)` | `let { onname } = $props()` + `onname?.(data)` |
| `<slot />` | `{@render children?.()}` |
| `<slot name="header" />` | `{@render header?.()}` |
| `let:item` on parent | snippet params: `{#snippet row(item)}` |
| `$$restProps` | `...rest` from `$props()` |
| `$$props.class` | `let { class: className } = $props()` |