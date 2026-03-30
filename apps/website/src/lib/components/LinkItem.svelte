<script lang="ts">
	let {
		title,
		url,
		icon = null,
		class: className = '',
		...rest
	} = $props<{
		title: string;
		url: string;
		icon?: string | null;
		class?: string;
		[key: string]: any;
	}>();
</script>

<a
	href={url}
	target="_blank"
	rel="noopener noreferrer"
	class="group relative flex items-center px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 {className}"
	{...rest}
>
	<div class="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
	
	{#if icon}
		<span class="mr-4 text-xl">{icon}</span>
	{/if}
	
	<span class="flex-grow font-medium text-center text-slate-100">
		{title}
	</span>
	
	<div class="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 group-hover:bg-indigo-500/20 text-slate-400 group-hover:text-indigo-300 transition-colors">
		<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
			<path d="M7 7h10v10"/><path d="M7 17 17 7"/>
		</svg>
	</div>
</a>
