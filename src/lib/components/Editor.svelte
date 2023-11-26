<script lang="ts">
	import { onMount } from 'svelte';
	import type { editor } from 'monaco-editor';
	import 'monaco-editor/min/vs/editor/editor.main.css';
	import vsDarkPlus from '$lib/edtior/darkPlus.json';
	import Sandbox from '@nyariv/sandboxjs';

	let monaco: typeof import('monaco-editor');
	let editor: editor.IStandaloneCodeEditor;

	let divContainer: HTMLDivElement;

	export async function executeCode() {
		const code = editor.getValue();

		const originalConsoleLog = console.log;
		let codeConsoleLogs: string[] = [];

		console.log = (...args: any[]) => {
			codeConsoleLogs.push(args.join(' '));
		};

		const sandbox = new Sandbox();
		const exec = sandbox.compile(code);
		const result = exec().run();

		console.log = originalConsoleLog;
		console.log(codeConsoleLogs);

		console.log(result);

		// // Send the code to the worker
		// worker.postMessage(code);
		// const result = new Function(code)();
		// console.log(result);

		// Working example of server side code compliation
		// fetch('http://localhost:5173/api/compile', {
		// 	method: 'POST',
		// 	body: JSON.stringify({ code }),
		// 	headers: {
		// 		'Content-Type': 'application/json'
		// 	}
		// })
		// 	.then((res) => res.json())
		// 	.then(console.log)
		// 	.catch(console.error);
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
			value: "function hello() {\n\tconsole.log('aaaaaa')\n\treturn 'Hello world!';\n}\n\nhello()",
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
