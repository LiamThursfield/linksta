<script lang="ts">
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();
</script>

<svelte:head>
	<title>{data.user.display_name} (@{data.user.handle}) | Linksta</title>
	<meta name="description" content={data.user.bio} />
</svelte:head>

<div class="min-h-screen bg-slate-950 text-slate-50 selection:bg-indigo-500/30">
	<!-- Background Effects -->
	<div class="fixed inset-0 overflow-hidden pointer-events-none">
		<div class="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full"></div>
		<div class="absolute top-[20%] -right-[10%] w-[35%] h-[35%] bg-purple-600/20 blur-[120px] rounded-full"></div>
		<div class="absolute -bottom-[10%] left-[20%] w-[30%] h-[30%] bg-blue-600/10 blur-[120px] rounded-full"></div>
	</div>

	<main class="relative z-10 max-w-2xl mx-auto px-6 pt-16 pb-24">
		<!-- Profile Header -->
		<div class="flex flex-col items-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
			{#if data.user.avatar_url}
				<div class="relative group mb-6">
					<div class="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full blur-md opacity-50 group-hover:opacity-80 transition-opacity duration-500"></div>
					<img 
						src={data.user.avatar_url} 
						alt={data.user.display_name} 
						class="relative w-24 h-24 rounded-full border-2 border-white/10 object-cover shadow-2xl"
					/>
				</div>
			{:else}
				<div class="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center mb-6 border-2 border-white/10 shadow-2xl">
					<span class="text-3xl font-bold text-slate-400">{data.user.display_name.charAt(0)}</span>
				</div>
			{/if}

			<h1 class="text-3xl font-bold mb-2 tracking-tight">
				{data.user.display_name}
			</h1>
			
			<p class="text-indigo-400 font-medium mb-4">
				@{data.user.handle}
			</p>

			{#if data.user.bio}
				<p class="text-center text-slate-400 max-w-sm leading-relaxed">
					{data.user.bio}
				</p>
			{/if}
		</div>

		<!-- Links List -->
		<div class="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
			{#each data.links as link (link.id)}
				<a
					href={link.url}
					target="_blank"
					rel="noopener noreferrer"
					class="group relative flex items-center px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10"
				>
					<div class="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
					
					{#if link.icon}
						<span class="mr-4 text-xl">{link.icon}</span>
					{/if}
					
					<span class="flex-grow font-medium text-center text-slate-100">
						{link.title}
					</span>
					
					<div class="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 group-hover:bg-indigo-500/20 text-slate-400 group-hover:text-indigo-300 transition-colors">
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
							<path d="M7 7h10v10"/><path d="M7 17 17 7"/>
						</svg>
					</div>
				</a>
			{/each}
		</div>

		<!-- Footer -->
		<footer class="mt-20 flex flex-col items-center opacity-40 hover:opacity-100 transition-opacity duration-500">
			<a href="/" class="flex items-center gap-2 group">
				<div class="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-xs group-hover:scale-110 transition-transform">
					L
				</div>
				<span class="font-bold tracking-tighter text-lg">linksta</span>
			</a>
		</footer>
	</main>
</div>

<style>
	:global(body) {
		background-color: #020617; /* Equivalent to bg-slate-950 */
	}

	.animate-in {
		animation-fill-mode: both;
	}

	/* Micro-animations for the list */
	@keyframes slideIn {
		from { 
			opacity: 0; 
			transform: translateY(20px); 
		}
		to { 
			opacity: 1; 
			transform: translateY(0); 
		}
	}

	.delay-150 { animation-delay: 150ms; }
</style>
