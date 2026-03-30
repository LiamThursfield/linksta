<script lang="ts">
	// No data needed for basic home page
</script>

<svelte:head>
	<title>Linksta | The only link you'll ever need</title>
	<meta name="description" content="Connect your audience to everything you do with one simple link." />
</svelte:head>

<div class="min-h-screen bg-slate-950 text-slate-50 selection:bg-indigo-500/30 font-['Outfit']">
	<!-- Background Effects (Same as /handle pages for consistency) -->
	<div class="fixed inset-0 overflow-hidden pointer-events-none">
		<div class="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[140px] rounded-full"></div>
		<div class="absolute top-[30%] -right-[15%] w-[45%] h-[45%] bg-purple-600/15 blur-[140px] rounded-full"></div>
		<div class="absolute -bottom-[20%] left-[10%] w-[40%] h-[40%] bg-blue-600/10 blur-[140px] rounded-full"></div>
	</div>

	<!-- Navigation -->
	<nav class="relative z-20 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
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

	<main class="relative z-10 flex flex-col items-center justify-center px-6 pt-24 pb-32 max-w-4xl mx-auto text-center">
		<!-- Badges -->
		<div class="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-xs font-bold text-indigo-400 mb-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
			<span class="relative flex h-2 w-2">
				<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
				<span class="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
			</span>
			NOW IN PRIVATE BETA
		</div>

		<!-- Title -->
		<h1 class="text-5xl sm:text-7xl font-bold tracking-tight mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 fill-mode-both">
			The only link <br />
			<span class="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">you'll ever need.</span>
		</h1>

		<!-- Description -->
		<p class="text-xl text-slate-400 mb-12 max-w-2xl leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200 fill-mode-both">
			Connect your audience to everything you do, everywhere you are. Linksta gives you a premium, single destination to share your world.
		</p>

		<!-- CTA Wrapper -->
		<div class="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
			<a href="/#" class="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-indigo-500/20 hover:scale-105 active:scale-95">
				Get Started for Free
			</a>
			<a href="/linksta" class="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-slate-100 font-bold rounded-2xl transition-all hover:shadow-lg">
				View Demo Profile
			</a>
		</div>

		<!-- Mini Preview (Mockup) -->
		<div class="mt-24 relative w-full max-w-md mx-auto group animate-in fade-in zoom-in-95 duration-1000 delay-500 fill-mode-both">
			<div class="absolute inset-0 bg-indigo-500/20 blur-3xl opacity-20 transition-opacity duration-700 pointer-events-none"></div>
			<div class="relative bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
				<div class="w-16 h-16 rounded-full bg-indigo-500/20 mb-4 mx-auto border border-indigo-500/30 flex items-center justify-center">
					<div class="w-12 h-12 rounded-full bg-slate-800 border border-white/10"></div>
				</div>
				<div class="h-3 w-32 bg-white/10 rounded-full mx-auto mb-2"></div>
				<div class="h-2 w-24 bg-white/5 rounded-full mx-auto mb-8"></div>
				<div class="space-y-3">
					<div class="h-10 w-full bg-white/5 border border-white/5 rounded-xl"></div>
					<div class="h-10 w-full bg-white/5 border border-white/5 rounded-xl"></div>
				</div>
			</div>
		</div>
	</main>

	<!-- Footer -->
	<footer class="relative z-10 border-t border-white/5 px-8 py-12 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 opacity-60">
		<div class="flex items-center gap-2">
			<div class="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-[10px]">L</div>
			<span class="font-bold tracking-tighter text-sm">linksta</span>
		</div>
		<p class="text-xs text-slate-500">
			&copy; 2024 Linksta Inc. All rights reserved. Built with Svelte & Vite+.
		</p>
		<div class="flex gap-6 text-xs text-slate-500">
			<a href="#" class="hover:text-slate-300">Privacy</a>
			<a href="#" class="hover:text-slate-300">Terms</a>
		</div>
	</footer>
</div>

<style>
	:global(body) {
		background-color: #020617; /* Equivalent to bg-slate-950 */
		overflow-x: hidden;
	}

	.animate-in {
		animation-fill-mode: both;
	}

	.fill-mode-both {
		animation-fill-mode: both;
	}
</style>
