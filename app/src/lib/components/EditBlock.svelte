<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Cell } from './PowerTable.svelte';
	import { EDIT_CONSTS } from './PowerTable.svelte'
	
	export var cell: Cell;

	const dispatch = createEventDispatcher();

	function submitEdits(e: Event) {
		dispatch(EDIT_CONSTS.SUBMISSION_EVENT, {
			cell: cell,
			domEvent: e
		});
	}

	function adjustHeight(node: HTMLElement) {
		node.style.height = node.scrollHeight + 'px';
	}
</script>

<div data-name="edit-block">
	<label>
		<span>
			<span>{cell.instructs?.title}</span>
		</span><textarea data-name={EDIT_CONSTS.DATA_ATTR_NAME} data-key={cell.instructs.key} use:adjustHeight>{cell.value}</textarea>
	</label>
	<button data-name="edit-submit" on:click={submitEdits}>✔️</button>
</div>
