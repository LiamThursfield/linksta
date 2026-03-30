<script lang="ts">
	let {
		variant = 'home', // 'home' or 'profile'
		class: className = '',
		...rest
	} = $props<{
		variant?: 'home' | 'profile';
		class?: string;
		[key: string]: any;
	}>();
</script>

<div class="fixed inset-0 overflow-hidden pointer-events-none {className}" {...rest}>
	{#if variant === 'home'}
		<div class="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[140px] rounded-full"></div>
		<div class="absolute top-[30%] -right-[15%] w-[45%] h-[45%] bg-purple-600/15 blur-[140px] rounded-full"></div>
		<div class="absolute -bottom-[20%] left-[10%] w-[40%] h-[40%] bg-blue-600/10 blur-[140px] rounded-full"></div>
	{:else}
		<div class="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full"></div>
		<div class="absolute top-[20%] -right-[10%] w-[35%] h-[35%] bg-purple-600/20 blur-[120px] rounded-full"></div>
		<div class="absolute -bottom-[10%] left-[20%] w-[30%] h-[30%] bg-blue-600/10 blur-[120px] rounded-full"></div>
	{/if}
</div>
