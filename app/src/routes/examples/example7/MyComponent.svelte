<script lang="ts">
	import type { Instructs } from '$lib/components/PowerTable.svelte';

	export var ptInstructs: Instructs;
	export var value: string;
	export var rowIndex: number;
	export var rowId: number;
	export var selectValues: Array<string>;
</script>

<label>
	<span>
		<span>{ptInstructs?.title}</span>
	</span>

	<select bind:value>
		{#each selectValues as question}
			<option value={question}>
				{question}
			</option>
		{/each}
	</select>
</label>
<button data-name="edit-submit">✔️</button>
