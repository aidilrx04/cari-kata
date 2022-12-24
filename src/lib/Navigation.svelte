<script lang="ts">
	export let showDropdown = false;

	const toggleDropdown = () => {
		showDropdown = !showDropdown;
	};
</script>

<nav class="flex  justify-between items-center relative bg-violet-800 text-gray-50 px-3 py-2">
	<div class="brand ">
		<span class="block text-2xl font-normal tracking-wider">Cari Kata</span>
	</div>
	<div class="nav-list">
		<button class="toggler text-2xl text-center w-[30px]" on:click={toggleDropdown}>
			{#if showDropdown}
				<i class="fas fa-times" />
			{:else}
				<i class="fas fa-bars" />
			{/if}
		</button>
		<div
			class="absolute top-full left-0 w-full h-0 min-h-4 overflow-hidden"
			style:height={showDropdown ? 'auto' : 0}
		>
			<div class="bg-gray-800 opacity-90 w-full top-0 left-0 absolute h-full z-10" />
			<ul class="block  bg-transparent w-full shadow-lg z-30 relative">
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
						class="py-2 px-3 flex justify-start items-center tracking-wide bg-inherit hover:bg-violet-700 transition-colors border-b-0 border-b-slate-400  "
					>
						<i class="fas fa-chart-simple mr-1 w-[25px] text-center" />
						Statistik
					</a>
				</li>
				<li class="bg-inherit">
					<a
						href="/about"
						class="py-2 px-3 flex justify-start items-center tracking-wide bg-inherit hover:bg-violet-700 transition-colors border-b-0 border-b-slate-400  "
					>
						<i class="fas fa-info-circle mr-1 w-[25px] text-center" />
						Tentang
					</a>
				</li>
			</ul>
		</div>
	</div>
</nav>
