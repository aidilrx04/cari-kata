<script lang="ts">
	import { getToken } from '$lib/authtoken';
	import { API_URL } from '$lib/config';
	import Cookies from 'js-cookie';

	let userData = {
		username: '',
		password: ''
	};

	const handleSubmit = async () => {
		const formBody = JSON.stringify(userData);

		const raw = await fetch(`${API_URL}/auth/register`, {
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			},
			method: 'post',
			body: formBody
		});

		const response = await raw.json();

		// store user token into cookie
		Cookies.set('token', response.token, {
			path: '/'
		});
	};
</script>

<div class="md:max-w-screen-md mx-auto">
	<header class="my-3">
		<h1 class="text-2xl text-slate-800 dark:text-slate-50 uppercase tracking-wider">Cipta Akaun</h1>
	</header>
	<main class="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg max-w-full">
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
					class="block mb-2 w-full bg-violet-600 px-4 py-3 rounded text-slate-50 hover:bg-violet-700 active:focus:bg-violet-800"
				>
					Daftar
				</button>
				<a href="/auth/login" class="text-center mb-2 underline text-sm text-slate-500">
					Log Masuk
				</a>
			</div>
		</form>

		<style>
			.input-group {
				@apply mb-4 block;
			}

			.input-group span {
				@apply block mb-2;
			}
		</style>
	</main>
</div>
