---
name: svelte-component-extractor
description: >
  Analyse a Svelte codebase and intelligently refactor it by extracting repeated
  patterns, large blocks, layout sections, and logic into well-structured, prop-driven
  Svelte components. Use this skill whenever the user mentions refactoring, componentising,
  breaking up, extracting, or cleaning up a Svelte project or .svelte files — even if they
  phrase it casually like "split this up", "make this more reusable", "tidy my Svelte app",
  or "turn this into components". Also trigger when the user uploads or pastes Svelte code
  and asks for improvement, organisation, or best practices advice.
---

# Svelte Component Extractor

Analyse Svelte files and extract logical units into reusable, extensible components
following Svelte best practices. Works with **Svelte 4** and **Svelte 5** (runes).

---

## Phase 1 — Understand the Project

Before touching any code:

1. **Detect Svelte version** from `package.json` (`svelte` dependency version or presence of `$state`, `$props`, `$derived` runes in source files).
2. **Map the file structure** — identify all `.svelte` files, `+page.svelte`, `+layout.svelte`, component directories, and any stores.
3. **Read each target file fully** before proposing changes. Never refactor what you haven't read.
4. **Identify the scope** — is the user asking about one file, one route, or the whole project?

---

## Phase 2 — Extraction Analysis

Scan each file for the following extraction signals. Read `references/extraction-patterns.md` for detailed heuristics and examples.

### High-priority signals (almost always extract)
- **Repeated UI patterns** — same or near-identical HTML structure (buttons, cards, badges, list items) appearing 2+ times with different data. → Extract to a prop-driven component.
- **Self-contained layout sections** — header, footer, nav, sidebar, hero present inline in a page or layout file. → Named layout components (`SiteHeader`, `SiteFooter`, etc.).
- **Logic-heavy blocks** — fetch + loading + error handling repeated across files; complex reactive state that belongs to one concept; business logic mixed into template files. → Extract to a store, a utility module, or an `AsyncLoader`-style wrapper component.
- **Large files** — `.svelte` files over ~150 lines of template markup. → Strong candidate for splitting along the above lines.
- **List + item patterns** — a `{#each}` block rendering a complex item (5+ lines per item). → Extract the item into its own component.

### Medium-priority signals (usually extract)
- **Inline form fields** — repeated `<label><input>` groupings. → `<FormField>` component.
- **Modal / drawer / tooltip markup** — overlay UI mixed into page logic. → Standalone overlay component.
- **Icon repetition** — inline SVGs used more than once. → `<Icon name="..." />` component.

### Lower-priority signals (extract only if complexity clearly warrants it)
- **Styling islands** — large scoped `<style>` blocks that belong to a visual concept. → Component with co-located styles.
- **Conditional render groups** — `{#if}` blocks with 20+ lines of markup. → Named conditional component.
- **Slots/content projection** — leave these as-is unless there's a clear reuse benefit; don't over-engineer.

---

## Phase 3 — Produce the Refactoring Plan and Get Approval

**ALWAYS present a plan and wait for explicit user approval before writing a single line of code.** Never skip this step, even if the user said "just do it" earlier in the conversation — confirm the plan first.

Format the plan as a numbered list, one entry per proposed extraction:

```
## Proposed Extractions

### 1. <ComponentName>.svelte  ← UI component
- **Source**: src/routes/+page.svelte, lines 45–92
- **Why**: Card layout repeated 4× with different data
- **Props**: `title: string`, `description: string`, `href: string`, `imageUrl?: string`
- **Replaces**: the {#each} item block in +page.svelte

### 2. fetchProducts.ts  ← logic extraction
- **Source**: src/routes/+page.svelte script block
- **Why**: Fetch + loading + error handling pattern; also used in /shop/+page.svelte
- **Exports**: `productsStore` (readable), `loadProducts()` (trigger fn)
- **Replaces**: inline onMount fetch in both page files

### 3. SiteHeader.svelte  ← layout section
- **Source**: src/routes/+layout.svelte, lines 1–34
- **Why**: Self-contained navigation section; will be needed across multiple layouts
- **Props**: `links: NavLink[]`, `currentPath: string`
- **Replaces**: inline <header> block in +layout.svelte
```

End with:
> **Ready to proceed?** Reply with:
> - **"all"** to apply everything above
> - **"1, 3"** (numbers) to apply only specific items
> - **"skip 2"** to apply all except specific items
> - Any feedback to adjust the plan before I start

**Do not write any files until the user replies.**

---

## Phase 4 — Write the Approved Extractions

Only proceed with items the user approved. If they approved a subset, note which items are being skipped at the start of your response.

For each extraction, follow the rules below. Read `references/svelte4-patterns.md` or `references/svelte5-patterns.md` depending on the detected version (or both if mixed). For logic extractions, read `references/logic-extraction.md`.

### Logic extractions (stores, fetchers, utilities)

- **Stores** live in `src/lib/stores/` as `.ts` or `.js` files. Use Svelte's `writable`/`readable`/`derived` (Svelte 4/5) or plain `$state` modules (Svelte 5 universal stores).
- **Fetch logic** moves to `src/lib/api/` or `src/lib/services/`. Export typed async functions, not raw fetch calls.
- **The `.svelte` file should contain no business logic** after extraction — only UI wiring and event handlers that directly relate to user interaction.
- Shared loading/error state should be part of the store, not repeated locally in each component.

### UI component rules

- **One component, one responsibility.** Don't pack unrelated concerns into one file.
- **Props over hardcoding.** Every value that could vary across instances should be a prop with a sensible default.
- **Extensibility by default.** Add a `class` prop (or `$$props`/`$$restProps` passthrough) so consumers can customise styling without forking. See examples in reference files.
- **Slots for content injection.** If a component renders children or has variable inner content, use a slot (`<slot />`) rather than a prop containing markup.
- **Co-locate styles.** Keep `<style>` blocks inside the component. Use CSS custom properties for theming hooks.
- **Emit events upward.** Child components dispatch `createEventDispatcher` events (Svelte 4) or callback props (Svelte 5) for user interactions rather than importing stores directly.
- **Accessibility.** Preserve and improve `aria-*` attributes, roles, and keyboard handling during extraction.

### Naming conventions
- PascalCase filenames: `UserCard.svelte`, `NavBar.svelte`
- Place in `src/lib/components/` (or a subdirectory if grouped, e.g. `src/lib/components/ui/`)
- If the project uses a component library (shadcn-svelte, Skeleton, daisyUI), follow its conventions

### Update the parent file
After creating the new component file, update the source file:
1. Add the import: `import ComponentName from '$lib/components/ComponentName.svelte'`
2. Replace the extracted markup with `<ComponentName prop1={...} />`
3. Remove any now-redundant script logic or styles from the parent

---

## Phase 5 — Extensibility Scaffolding

For each component, add the following unless explicitly unwanted:

### Svelte 4
```svelte
<script>
  /** @type {string} */
  export let variant = 'default'; // 'default' | 'outlined' | 'ghost'
  
  /** Additional CSS classes for the root element */
  export let className = '';

  // Forward all unknown attributes to the root element
</script>

<div class="component-root {className}" {...$$restProps}>
  <slot />
</div>
```

### Svelte 5
```svelte
<script>
  let { 
    variant = 'default',
    class: className = '',
    children,
    ...rest
  } = $props();
</script>

<div class="component-root {className}" {...rest}>
  {@render children?.()}
</div>
```

---

## Phase 6 — Verify

After all extractions:

1. **Check imports are correct** — no broken paths, correct `$lib` alias usage
2. **Check prop types match usage** — every prop passed in the parent exists in the child's definition
3. **Check events are wired up** — `on:click` / callback props forwarded correctly
4. **Check styles aren't lost** — scoped styles that were in the parent are now in the child
5. **Summarise** what was created and changed in a short message to the user

---

## Common Mistakes to Avoid

- ❌ Don't write any files before the user approves the plan — **always wait**
- ❌ Don't extract a block that's only used once and is simple — leave it inline
- ❌ Don't use `bind:` on props unless two-way binding is genuinely needed
- ❌ Don't import stores directly into presentational components — pass data as props instead
- ❌ Don't leave fetch logic or async state management inside `.svelte` files when it's shared
- ❌ Don't forget to handle `undefined`/optional props with defaults
- ❌ Don't strip `aria-label` or other a11y attributes during extraction
- ❌ Don't create a new store for data that's only used in one component — local `$state` is fine

---

## Reference Files

Load these as needed — don't load all of them upfront:

| File | When to read |
|------|--------------|
| `references/extraction-patterns.md` | When analysing a file for extraction opportunities |
| `references/logic-extraction.md` | When extracting stores, fetch logic, or business logic from .svelte files |
| `references/svelte4-patterns.md` | When writing components for a Svelte 4 project |
| `references/svelte5-patterns.md` | When writing components for a Svelte 5 / runes project |
| `references/extensibility-patterns.md` | When designing the public API of a new component |