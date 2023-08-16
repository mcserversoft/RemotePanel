<script>
	//FUTURE convert this to ts
	import { Button } from 'flowbite-svelte';
	import Cropper from 'svelte-easy-crop';
	import Icon from './icon.svelte';
	import { mdiClose, mdiCrop } from '@mdi/js';
	import { getCroppedImg } from '$lib/code/imageCropper';
	import { createEventDispatcher } from 'svelte';

	const acceptedFileTypes = ['image/gif', 'image/jpeg', 'image/png'];
	const dispatch = createEventDispatcher();

	let crop = { x: 0, y: 0 };
	let zoom = 1;
	let image, fileinput, pixelCrop, croppedImage;

	function onFileSelected(e) {
		let imageFile = e.target.files[0];

		if (!isValidUpload(imageFile)) {
			confirm("You've selected an invalid image, this file type isn't supported at this time.");
			return;
		}

		let reader = new FileReader();
		reader.onload = (e) => {
			image = e.target.result;
		};
		reader.readAsDataURL(imageFile);
	}

	function isValidUpload(file) {
		const fileType = file['type'];
		return acceptedFileTypes.includes(fileType);
	}

	function updateCropInfo(e) {
		pixelCrop = e.detail.pixels;
	}

	function reset() {
		croppedImage = null;
		image = null;
	}

	async function handleCrop() {
		croppedImage = await getCroppedImg(image, pixelCrop);
		dispatch('cropped', croppedImage);
	}

	function handleCancel() {
		reset();
		dispatch('canceled');
	}
</script>

{#if !image}
	<label class="block mb-2 text-sm font-medium text-gray-800 dark:text-white" for="avatar_upload">Upload file</label>
	<input
		on:change={(e) => onFileSelected(e)}
		bind:this={fileinput}
		class="block w-full text-sm text-gray-800 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
		id="avatar_upload"
		type="file"
		accept=".jpg, .jpeg, .png"
	/>
{:else}
	<div style="position: relative; width: 100%; height: 300px;">
		<Cropper {image} {crop} {zoom} aspect={1} cropShape={'round'} zoomSpeed={0.25} on:cropcomplete={updateCropInfo} />
	</div>

	<div class="flex items-center justify-center space-x-3 mt-6">
		<Button type="button" on:click={handleCrop} color="blue">
			<Icon data={mdiCrop} class="mr-2 -ml-1" /> Crop
		</Button>

		<Button type="button" on:click={handleCancel} color="red">
			<Icon data={mdiClose} class="mr-2 -ml-1" /> Cancel
		</Button>
	</div>
{/if}
