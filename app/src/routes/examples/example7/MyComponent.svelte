<script lang="ts">
import { createEventDispatcher } from 'svelte';

export let instructKey: number;
export let instructTitle: string;
export let value: string;
export let rowIndex: number;
export let rowId: number;

export let selectValues: string[];

const dispatch = createEventDispatcher();

function submitEdits(e: Event) {
	dispatch('edit-submit-event', {
		rowIndex: rowIndex,
		domEvent: e
	});
}
</script>

<div data-name="edit-block">
	<label>
		<span>
			<span>{instructTitle}</span>
		</span><select data-key={instructKey} data-name='edit-input'>
			{#each selectValues as anOption}
				<option value={anOption} selected={anOption == value}>
					{anOption}
				</option>
			{/each}
		</select>
	</label>
	<button data-name="edit-submit" on:click={submitEdits}>✔️</button>
</div>