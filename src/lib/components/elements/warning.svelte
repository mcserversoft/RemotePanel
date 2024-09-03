<script lang="ts">
	import { mdiAlertOctagram, mdiAlertRhombus, mdiCheck, mdiInformation, mdiShieldLock } from '@mdi/js';
	import Icon from './icon.svelte';
	import { WarningType } from '$lib/code/panel';

	export let message: string = '';
	export let type: WarningType = WarningType.Error;

	function getIcon() {
		switch (type) {
			case WarningType.Warning:
				return mdiAlertRhombus;

			case WarningType.Permission:
				return mdiShieldLock;

			case WarningType.Info:
				return mdiInformation;

			case WarningType.Success:
				return mdiCheck;

			case WarningType.Error:
			default:
				return mdiAlertOctagram;
		}
	}
	function getColor() {
		switch (type) {
			case WarningType.Warning:
				return 'text-orange-500 bg-orange-100 rounded-lg dark:bg-orange-700 dark:text-orange-200';

			case WarningType.Permission:
				return 'text-purple-500 bg-purple-100 rounded-lg dark:bg-purple-700 dark:text-purple-200';

			case WarningType.Info:
				return 'text-blue-500 bg-blue-100 rounded-lg dark:bg-blue-700 dark:text-blue-200';

			case WarningType.Success:
				return 'text-green-500 bg-green-100 rounded-lg dark:bg-green-700 dark:text-green-200';

			case WarningType.Error:
			default:
				return 'text-red-500 bg-red-100 rounded-lg dark:bg-red-700 dark:text-red-200';
		}
	}
</script>

<div class="flex items-center w-full p-3 mb-3 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
	<div class={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 ${getColor()}  `}>
		<Icon data={getIcon()} />
		<span class="sr-only">Warning icon</span>
	</div>
	<div class="ml-3 text-sm font-normal">{message}<slot /></div>
</div>
