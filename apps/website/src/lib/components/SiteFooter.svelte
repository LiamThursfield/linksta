<script lang="ts">
	let { 
		variant = 'full', // 'full' or 'minimal'
		class: className = '',
		...rest
	} = $props<{
		variant?: 'full' | 'minimal';
		class?: string;
		[key: string]: any;
	}>();
</script>

{#if variant === 'full'}
	<footer class="relative z-10 border-t border-white/5 px-8 py-12 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 opacity-60 {className}" {...rest}>
		<div class="flex items-center gap-2">
			<div class="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-[10px]">L</div>
			<span class="font-bold tracking-tighter text-sm">linksta</span>
		</div>
		<p class="text-xs text-slate-500">
			&copy; {new Date().getFullYear()} Linksta Inc. All rights reserved. Built with Svelte & Vite+.
		</p>
		<div class="flex gap-6 text-xs text-slate-500">
			<a href="#" class="hover:text-slate-300">Privacy</a>
			<a href="#" class="hover:text-slate-300">Terms</a>
		</div>
	</footer>
{:else}
	<footer class="mt-20 flex flex-col items-center opacity-40 hover:opacity-100 transition-opacity duration-500 {className}" {...rest}>
		<a href="/" class="flex items-center gap-2 group">
			<div class="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-xs group-hover:scale-110 transition-transform">
				L
			</div>
			<span class="font-bold tracking-tighter text-lg">linksta</span>
		</a>
	</footer>
{/if}
