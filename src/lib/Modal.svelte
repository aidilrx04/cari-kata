<script lang="ts">
	import { createEventDispatcher, onDestroy, SvelteComponent } from 'svelte';

	const dispatch = createEventDispatcher();
	const close = () => dispatch('close');

	let modal: HTMLDivElement;
	export let props: any = {};
	export let _class: string = '';

	const handle_keydown = (e) => {
		if (e.key === 'Escape') {
			close();
			return;
		}

		if (e.key === 'Tab') {
			// trap focus
			const nodes = modal.querySelectorAll<HTMLElement>('*');
			const tabbable = Array.from(nodes).filter((n) => n.tabIndex >= 0);

			let index = tabbable.indexOf(document.activeElement as HTMLElement);
			if (index === -1 && e.shiftKey) index = 0;

			index += tabbable.length + (e.shiftKey ? -1 : 1);
			index %= tabbable.length;

			tabbable[index].focus();
			e.preventDefault();
		}
	};

	const previously_focused = typeof document !== 'undefined' && document.activeElement;

	if (previously_focused) {
		onDestroy(() => {
			// ignored because we know that shit is active element
			// @ts-ignore
			previously_focused.focus();
		});
	}
</script>

<svelte:window on:keydown={handle_keydown} />

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="modal-background" />

<div {...props} class="modal {_class}" role="dialog" aria-modal="true" bind:this={modal}>
	<slot name="header" />
	<slot />
	<slot name="footer">
		<!-- svelte-ignore a11y-autofocus -->
		<button autofocus on:click={close}>close modal</button>
	</slot>
</div>

<style>
	.modal-background {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		/* background: rgba(0, 0, 0, 0.3); */
	}

	.modal {
		position: absolute;
		left: 50%;
		top: 50%;
		overflow: auto;
		transform: translate(-50%, -50%);
	}
</style>
