<script lang="ts">
import { createEventDispatcher } from 'svelte';

export let instructKey: number;
export let instructTitle: string;
export let value: string;
export let rowIndex: number;
export let rowId: number;

const dispatch = createEventDispatcher();

function submitEdits(e: Event) {
	dispatch('edit-submit-event', {
		rowIndex: rowIndex,
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
			<span>{instructTitle}</span>
		</span><textarea data-name="edit-input" data-key={instructKey} use:adjustHeight>{value}</textarea>
	</label>
	<button data-name="edit-submit" on:click={submitEdits}>✔️</button>
</div>
