<template>
	<div class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
		<div class="relative flex flex-col items-center max-w-lg gap-4 p-6 rounded-md shadow-md sm:py-8 sm:px-12 bg-gray-900 text-white">
			<button @click="$emit('close')" class="absolute top-2 right-2">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" class="flex-shrink-0 w-6 h-6">
					<polygon points="427.314 107.313 404.686 84.687 256 233.373 107.314 84.687 84.686 107.313 233.373 256 84.686 404.687 107.314 427.313 256 278.627 404.686 427.313 427.314 404.687 278.627 256 427.314 107.313"></polygon>
				</svg>
			</button>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-8 h-8 fill-current shrink-0 text-yellow-500">
				<path d="M451.671,348.569,408,267.945V184c0-83.813-68.187-152-152-152S104,100.187,104,184v83.945L60.329,348.568A24,24,0,0,0,81.432,384h86.944c-.241,2.636-.376,5.3-.376,8a88,88,0,0,0,176,0c0-2.7-.135-5.364-.376-8h86.944a24,24,0,0,0,21.1-35.431ZM312,392a56,56,0,1,1-111.418-8H311.418A55.85,55.85,0,0,1,312,392ZM94.863,352,136,276.055V184a120,120,0,0,1,240,0v92.055L417.137,352Z"></path>
				<rect width="32" height="136" x="240" y="112"></rect>
				<rect width="32" height="32" x="240" y="280"></rect>
			</svg>
			<h2 class="text-xl leading-tight tracking-wide text-yellow-500">{{ title }}</h2>
            <h2 class="leading-tight tracking-wide">Please install Unisat wallet first.</h2>
			<p class="text-xl flex-1 text-center text-gray-300">
                <a href="https://unisat.io/" target="_blank" class="hover:text-amber-700 text-blue-500">https://unisat.io/</a>
			</p>
            <button @click="$emit('close')" class="mt-4 px-6 py-2 rounded-sm border border-blue-500">Close</button>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue';

const title = ref('Can not find Unisat wallet!');
defineEmits(['close']);
</script>