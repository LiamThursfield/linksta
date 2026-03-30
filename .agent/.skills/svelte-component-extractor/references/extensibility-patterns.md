# Extensibility Patterns

How to design components that are easy to extend without forking or rewriting.

---

## The Extension Hierarchy

Design components to be extended in this order of preference:

1. **Props** — the primary extension point; cover the 80% case
2. **CSS custom properties** — theming without prop drilling
3. **Slots / Snippets** — content injection for structural variation
4. **Rest props / class forwarding** — escape hatch for one-off customisation
5. **Subclassing via wrapper components** — for major variants

---

## 1. CSS Custom Properties for Theming

Instead of a `color` prop that accepts a hex value, expose a CSS variable:

```svelte
<!-- Badge.svelte -->
<span class="badge" style="--badge-bg: {bg}; --badge-color: {color}">
  <slot />
</span>

<style>
  .badge {
    background: var(--badge-bg, #e2e8f0);
    color: var(--badge-color, #1a202c);
    padding: 0.25em 0.6em;
    border-radius: 9999px;
    font-size: 0.75rem;
  }
</style>
```

Consumers can also override globally via CSS:
```css
.my-page .badge {
  --badge-bg: hotpink;
}
```

---

## 2. The "class" Forwarding Pattern

Always accept and forward a `class` prop (or `className` to avoid conflicts) so consumers can add utility classes or override styles:

**Svelte 4**:
```svelte
<script>
  export let className = '';
</script>
<div class="card {className}" {...$$restProps}>
  <slot />
</div>
```

**Svelte 5**:
```svelte
<script>
  let { class: className = '', children, ...rest } = $props();
</script>
<div class="card {className}" {...rest}>
  {@render children?.()}
</div>
```

This lets callers do: `<Card class="mt-8 border-red-500">` without modifying the component.

---

## 3. Structural Slots / Snippets

Design components with named regions that callers can replace:

```svelte
<!-- DataTable.svelte (Svelte 5) -->
<script>
  let { 
    rows,
    columns,
    emptyState,    // snippet: shown when no rows
    rowActions,    // snippet: per-row action buttons
    children       // fallback
  } = $props();
</script>

<table>
  <thead>
    <tr>
      {#each columns as col}
        <th>{col.label}</th>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#if rows.length === 0}
      <tr><td colspan={columns.length}>
        {#if emptyState}
          {@render emptyState()}
        {:else}
          <span class="empty">No data</span>
        {/if}
      </td></tr>
    {:else}
      {#each rows as row}
        <tr>
          {#each columns as col}
            <td>{row[col.key]}</td>
          {/each}
          {#if rowActions}
            <td>{@render rowActions(row)}</td>
          {/if}
        </tr>
      {/each}
    {/if}
  </tbody>
</table>
```

---

## 4. The Compound Component Pattern

For complex UI (accordions, tabs, dropdowns), split into a parent + child pair that share state via context:

```svelte
<!-- Tabs.svelte -->
<script>
  import { setContext } from 'svelte';
  
  let { children } = $props(); // Svelte 5
  let activeTab = $state(0);
  
  setContext('tabs', {
    get activeTab() { return activeTab; },
    setActive: (i) => { activeTab = i; }
  });
</script>

<div class="tabs">{@render children?.()}</div>
```

```svelte
<!-- TabPanel.svelte -->
<script>
  import { getContext } from 'svelte';
  
  let { index, children } = $props();
  const { activeTab } = getContext('tabs');
</script>

{#if activeTab === index}
  <div class="tab-panel">{@render children?.()}</div>
{/if}
```

Usage:
```svelte
<Tabs>
  <TabPanel index={0}>Tab 1 content</TabPanel>
  <TabPanel index={1}>Tab 2 content</TabPanel>
</Tabs>
```

---

## 5. Prop Spreading for HTML Attribute Passthrough

Use `$$restProps` (Svelte 4) or rest destructuring (Svelte 5) to pass unknown attributes to the root element. This is especially important for:
- `aria-*` attributes callers need to add
- `data-*` attributes for testing
- Native event handlers (`onclick`, `onkeydown`)
- Form attributes (`name`, `required`, `autofocus`)

```svelte
<!-- Svelte 5: Button.svelte -->
<script>
  let { variant = 'primary', children, ...rest } = $props();
</script>

<!-- rest might contain: disabled, aria-label, data-testid, onclick, type... -->
<button class="btn btn-{variant}" {...rest}>
  {@render children?.()}
</button>
```

---

## 6. Wrapper / Specialisation Pattern

Instead of a complex `<Button variant="icon-only" size="sm" shape="circle" />`, create a specialised component that wraps the base:

```svelte
<!-- IconButton.svelte -->
<script>
  import Button from './Button.svelte';
  
  let { icon, label, ...rest } = $props();
</script>

<Button variant="ghost" size="sm" aria-label={label} class="icon-btn" {...rest}>
  {@render icon()}
</Button>
```

This keeps `Button.svelte` simple while enabling `IconButton.svelte` to encapsulate the combination.

---

## Checklist for New Components

Before finalising a new component, verify:

- [ ] Has a `class` / `className` prop that's forwarded to the root element
- [ ] Uses `$$restProps` or `...rest` so HTML attributes pass through
- [ ] Required props are clearly required (no misleading defaults)
- [ ] Optional props have sensible defaults so the component works out of the box
- [ ] Content injection is via slots/snippets, not string props containing HTML
- [ ] Events are forwarded or exposed as callback props
- [ ] CSS custom properties are used for colours/sizes that might need theming
- [ ] Component works without any props at all (if it should have a zero-config state)
- [ ] `aria-*` attributes are set correctly and can be overridden via rest props