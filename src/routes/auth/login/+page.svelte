<script lang="ts">
	import { API_URL } from '$lib/config';
	import Cookies from 'js-cookie';

	let userData = {
		username: '',
		password: ''
	};

	const handleSubmit = async () => {
		const formBody = JSON.stringify(userData);

		const raw = await fetch(`${API_URL}/auth/login`, {
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			},
			method: 'post',
			body: formBody
		});

		if (raw.status === 200) {
			const response = await raw.json();
			console.log(response);
			Cookies.set('token', response.token, {
				path: '/'
			});
		}
	};
</script>

<div class="md:max-w-screen-md mx-auto">
	<header class="my-3">
		<h1 class="text-2xl uppercase text-slate-800 dark:text-slate-50 tracking-wider">Log Masuk</h1>
	</header>
	<main class="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
		<form on:submit|preventDefault={handleSubmit}>
			<label for="username" class="input-group">
				<span>Nama</span>
				<input
					bind:value={userData.username}
					class="block w-full rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 py-3 px-2"
					type="text"
					id="username"
				/>
			</label>
			<label for="password" class="input-group">
				<span>Katalaluan</span>
				<input
					bind:value={userData.password}
					class="block w-full rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 py-3 px-2"
					type="password"
					id="password"
				/>
			</label>
			<div class="input-group">
				<button
					type="submit"
					class="block mb-2 w-full bg-violet-600 py-3 px-4 rounded text-slate-50 hover:bg-violet-700 active:focus:bg-violet-800"
				>
					Log Masuk
				</button>
				<a href="/auth/register" class="mb-2 text-sm underline text-slate-500 text-center">
					Daftar Akaun
				</a>
			</div>
		</form>
		<style>
			.input-group {
				@apply block mb-4;
			}

			.input-group span {
				@apply mb-2 block;
			}
		</style>
	</main>
</div>
