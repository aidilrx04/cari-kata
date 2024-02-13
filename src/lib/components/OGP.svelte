<script lang="ts">
	import { page } from '$app/stores';
	import CoverImage from './images/ogp-cover-image.jpg';

	export let title = 'Cari Kata';
	export let type = 'website';
	export let image = '';
	export let url = $page.url.toString();
	export let description =
		'Cari Kata adalah sebuah permainan cari kata dalam talian. Main sekarang!';
	export let locale = 'ms_MY';
	export let site_name = 'Cari Kata';
</script>

<svelte:head>
	<!-- OGP tags -->
	<meta property="og:title" content={title} />
	<meta property="og:type" content={type} />
	<meta property="og:image" content={image.length === 0 ? CoverImage : image} />
	<meta property="og:url" content={url} />
	<meta property="og:description" content={description} />
	<meta property="og:locale" content={locale} />
	<meta property="og:site_name" content={site_name} />

	<!-- Twitter Cards tags -->
	<meta property="twitter:card" content="summary" />
</svelte:head>
