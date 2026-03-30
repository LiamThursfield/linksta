<script lang="ts">
	import type { PageData } from './$types';
	import LinkItem from '$lib/components/LinkItem.svelte';
	import BackgroundEffects from '$lib/components/BackgroundEffects.svelte';
	import SiteFooter from '$lib/components/SiteFooter.svelte';

	let { data } = $props<{ data: PageData }>();
</script>

<svelte:head>
	<title>{data.user.display_name} (@{data.user.handle}) | Linksta</title>
	<meta name="description" content={data.user.bio} />
</svelte:head>

<div class="min-h-screen bg-slate-950 text-slate-50 selection:bg-indigo-500/30">
	<!-- Background Effects -->
	<BackgroundEffects variant="profile" />

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
				<LinkItem title={link.title} url={link.url} icon={link.icon} />
			{/each}
		</div>

		<!-- Footer -->
		<SiteFooter variant="minimal" />
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
