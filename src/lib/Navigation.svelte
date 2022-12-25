<script lang="ts">
	export let showDropdown = false;

	let dropdown: HTMLDivElement;

	const toggleDropdown = () => {
		showDropdown = !showDropdown;
	};
</script>

<div class="bg-violet-800">
	<div class="max-w-screen-xl mx-auto">
		<nav class="flex justify-between items-center relative  text-gray-50 px-3 py-2">
			<div class="brand ">
				<span class="block text-4xl font-normal tracking-wider">
					<a href="/">Cari Kata</a>
				</span>
			</div>
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
					nav-list block  bg-transparent w-full shadow-lg z-30 relative 
					lg:flex"
					>
						<li class="bg-inherit">
							<a
								href="/"
								class="py-2 px-3 flex justify-start items-center tracking-wide bg-inherit hover:bg-violet-700 transition-colors border-b border-b-slate-400  "
							>
								<i class="fas fa-home mr-1 w-[25px] text-center" />
								Utama
							</a>
						</li>
						<li class="bg-inherit">
							<a
								href="/mode"
								class="py-2 px-3 flex justify-start items-center tracking-wide bg-inherit hover:bg-violet-700 transition-colors border-b border-b-slate-400  "
							>
								<i class="fas fa-play mr-1 w-[25px] text-center" />
								Main
							</a>
						</li>
						<li class="bg-inherit">
							<a
								href="/stats"
								class="py-2 px-3 flex justify-start items-center tracking-wide bg-inherit hover:bg-violet-700 transition-colors border-b border-b-slate-400  "
							>
								<i class="fas fa-chart-simple mr-1 w-[25px] text-center" />
								Statistik
							</a>
						</li>
					</ul>
				</div>
				<button class="lg:hidden toggler text-4xl text-center w-[30px]" on:click={toggleDropdown}>
					{#if showDropdown}
						<i class="fas fa-times" />
					{:else}
						<i class="fas fa-bars" />
					{/if}
				</button>
			</div>
		</nav>
	</div>
</div>

<style>
	ul.nav-list a {
		@apply border-b-0;
	}
</style>
