<script lang="ts">
	import type { Instructs } from './PowerTable.svelte';

	export var ptInstructs: Instructs;
	export var value: string;
	export var rowIndex: number;
	export var rowId: number;
</script>

<label>
	<span>
		<span>{ptInstructs?.title}</span>
	</span><textarea data-name="edit-textarea" data-key={ptInstructs.key}>{value}</textarea>
</label>
<button data-name="edit-submit">✔️</button>
