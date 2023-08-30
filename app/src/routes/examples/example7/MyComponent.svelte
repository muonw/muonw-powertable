<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Cell } from '$lib/components/PowerTable.svelte';
	import { EDIT_CONSTS } from '$lib/components/PowerTable.svelte'

	export var cell: Cell;
	export var selectValues: Array<string>;

	const dispatch = createEventDispatcher();

	function submitEdits(e: Event) {
		dispatch(EDIT_CONSTS.SUBMISSION_EVENT, {
			cell: cell,
			domEvent: e
		});
	}
</script>

<label>
	<span>
		<span>{cell.instructs?.title}</span>
	</span>

	<select bind:value={cell.value} data-key={cell.instructs.key} data-name={EDIT_CONSTS.DATA_ATTR_NAME} >
		{#each selectValues as anOption}
			<option value={anOption}>
				{anOption}
			</option>
		{/each}
	</select>
</label>
<button on:click={submitEdits}>✔️</button>
