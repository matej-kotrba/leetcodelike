<script lang="ts">
	import { onMount } from 'svelte';
	import type { editor } from 'monaco-editor';
	import 'monaco-editor/min/vs/editor/editor.main.css';
	import vsDarkPlus from '$lib/edtior/darkPlus.json';

	let monaco: typeof import('monaco-editor');
	let editor: editor.IStandaloneCodeEditor;
	let worker: Worker;

	let divContainer: HTMLDivElement;

	export function executeCode() {
		const code = editor.getValue();
		fetch('http://localhost:5173/api/compile', {
			method: 'POST',
			body: JSON.stringify({ code }),
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then((res) => res.json())
			.then(console.log)
			.catch(console.error);
	}

	onMount(async () => {
		monaco = await import('monaco-editor');

		//@ts-ignore
		monaco.editor.defineTheme('vs-dark-plus', vsDarkPlus);

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
			theme: 'vs-dark-plus'
		});
	});

	export function getCode(): string {
		return editor ? editor.getValue() : '';
	}
</script>

<div id="container" bind:this={divContainer}></div>
<button on:click={executeCode}>Execute code</button>

<style>
	#container {
		width: 100%;
		height: 300px; /* Set the desired height */
		border: 1px solid #ccc;
	}
</style>
