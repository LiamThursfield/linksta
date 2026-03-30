<script lang="ts">
	let {
		class: className = '',
		...rest
	} = $props<{
		class?: string;
		[key: string]: any;
	}>();
</script>

<nav class="relative z-20 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto {className}" {...rest}>
	<div class="flex items-center gap-2 group cursor-pointer">
		<div class="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-indigo-500/20">
			L
		</div>
		<span class="font-bold tracking-tighter text-2xl">linksta</span>
	</div>
	<div class="hidden sm:flex items-center gap-8 text-sm font-medium text-slate-400">
		<a href="/linksta" class="hover:text-slate-100 transition-colors">Demo</a>
		<a href="#" class="hover:text-slate-100 transition-colors">Pricing</a>
		<a href="#" class="hover:text-slate-100 transition-colors">Blog</a>
	</div>
	<a href="/#" class="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-full text-sm font-semibold transition-all">
		Log in
	</a>
</nav>
