<script lang="ts">
	import { onMount } from 'svelte';
	import type { editor } from 'monaco-editor';
	import 'monaco-editor/min/vs/editor/editor.main.css';
	import vsDarkPlus from '$lib/edtior/darkPlus.json';

	let monaco: typeof import('monaco-editor');
	let editor: editor.IStandaloneCodeEditor;
	let divContainer: HTMLDivElement;

	onMount(async () => {
		monaco = await import('monaco-editor');

		// Load the language services
		await Promise.all([
			import('monaco-editor/esm/vs/language/typescript/ts.worker?worker'),
			import('monaco-editor/esm/vs/editor/editor.worker?worker')
		]).then(([tsWorker, editorWorker]) => {
			self.MonacoEnvironment = {
				getWorker(_, label) {
					if (label === 'typescript' || label === 'javascript') {
						return new tsWorker.default();
					}
					return new editorWorker.default();
				}
			};
		});

		editor = monaco.editor.create(divContainer, {
			value: "function hello() {\n\talert('Hello world!');\n}",
			language: 'javascript',
			theme: 'vs-dark'
		});
	});

	export function getCode(): string {
		return editor ? editor.getValue() : '';
	}
</script>

<div id="container" bind:this={divContainer}></div>

<style>
	#container {
		width: 100%;
		height: 300px; /* Set the desired height */
		border: 1px solid #ccc;
	}
</style>
