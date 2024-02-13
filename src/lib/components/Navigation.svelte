<script lang="ts">
	import { currentTheme, theme } from '../theme';

	export let showDropdown = false;

	const links = [
		{
			label: 'Utama',
			icon: 'fa-home',
			url: '/'
		},
		{
			label: 'Main',
			icon: 'fa-play',
			url: '/mode'
		},
		{
			label: 'Statistik',
			icon: 'fa-chart-simple',
			url: '/stats'
		},
		{
			label: 'Tutorial',
			icon: 'fa-question',
			url: '/tutorial'
		},
		{
			label: 'Tentang',
			icon: 'fa-circle-info',
			url: '/about'
		}
	];

	const toggleDropdown = () => {
		showDropdown = !showDropdown;
	};
</script>

<div class="bg-violet-800 z-50 relative">
	<div class="max-w-screen-xl mx-auto bg-inherit">
		<nav class="flex justify-between items-center relative text-slate-50 px-3 py-2 bg-inherit">
			<div class="brand">
				<span class="block text-4xl font-normal tracking-wider">
					<a href="/" class="!text-slate-50">Cari Kata</a>
				</span>
			</div>
			<div class="right-side flex flex-row-reverse lg:flex-row items-center bg-inherit">
				<div class="nav-list">
					<div
						class="
						def: absolute top-full left-0 w-full min-h-4 overflow-hidden transition-all
						bs: {showDropdown ? 'block' : 'hidden'}
						lar: lg:block lg:relative
						"
					>
						<div
							class="bg-gray-800 lg:bg-transparent opacity-90 w-full top-0 left-0 absolute h-full z-10"
						/>
						<ul
							class="
						nav-list block bg-transparent w-full shadow-lg z-30 relative
						lg:flex"
						>
							{#each links as link}
								<li class="bg-inherit">
									<a
										href={link.url}
										class="!text-slate-50 py-2 px-3 flex justify-start items-center tracking-wide bg-inherit hover:bg-violet-700 transition-colors border-b border-b-slate-400"
									>
										<i class="fas {link.icon} mr-1 w-[25px] text-center" />
										{link.label}
									</a>
								</li>
							{/each}
						</ul>
					</div>
					<button
						class="lg:hidden toggler text-2xl px-4 py-2 text-center rounded-md hover:bg-violet-700 focus-within:bg-violet-700"
						on:click={toggleDropdown}
					>
						{#if showDropdown}
							<i class="ph ph-x" />
						{:else}
							<i class="ph ph-list" />
						{/if}
					</button>
				</div>
				<div class="theme-switcher dropdown relative bg-inherit group">
					<button class="px-4 py-2 text-2xl hover:bg-violet-700 rounded-md peer">
						<i class="ph-fill {$currentTheme === 'dark' ? 'ph-moon-stars' : 'ph-sun'}" />
					</button>
					<div
						class="z-50 hidden peer-focus-within:block group-focus-within:block dropdown-content absolute top-full w-32 right-0 bg-inherit py-2 rounded-lg overflow-hidden"
					>
						<ul>
							<li>
								<button
									on:click={() => ($theme = 'light')}
									class="theme-button {$theme === 'light' ? 'active' : ''}"
								>
									<i class="ph-fill ph-sun" />
									<span>Light</span>
								</button>
							</li>
							<li>
								<button
									on:click={() => ($theme = 'dark')}
									class="theme-button {$theme === 'dark' ? 'active' : ''}"
								>
									<i class="ph-fill ph-moon-stars" />
									<span>Dark</span>
								</button>
							</li>
							<li>
								<button
									on:click={() => ($theme = 'system')}
									class="theme-button {$theme === 'system' ? 'active' : ''}"
								>
									<i class="ph-fill ph-desktop" />
									<span>System</span>
								</button>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</nav>
	</div>
</div>

<style>
	ul.nav-list a {
		@apply border-b-0;
	}

	.theme-switcher .theme-button {
		@apply flex items-center justify-start gap-3 w-full text-left px-6 py-1;
	}

	.theme-button.active {
		@apply !bg-violet-900 text-slate-50;
	}

	.theme-switcher .theme-button:hover {
		@apply bg-violet-700;
	}

	.theme-button i {
		@apply text-2xl text-slate-300;
	}
</style>
