<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
    <div class="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
      <button @click="$emit('close')" class="absolute top-5 right-5 text-slate-400 hover:text-slate-600">
        <X class="w-5 h-5" />
      </button>

      <div class="flex items-center space-x-3 mb-4">
        <span class="text-3xl">🦭</span>
        <div>
          <h3 class="font-bold text-slate-900 text-base">{{ t('feedback_title') }}</h3>
          <p class="text-xs text-slate-500">{{ t('feedback_subtitle') }}</p>
        </div>
      </div>

      <div class="space-y-4 text-xs">
        <p class="text-slate-600 leading-relaxed">
          {{ t('feedback_body') }}
        </p>

        <div class="p-4 bg-blue-50 rounded-2xl border border-blue-200 space-y-2">
          <p class="font-semibold text-blue-900">💬 Submit on GitHub or Ko-fi:</p>
          <div class="flex flex-col sm:flex-row gap-2">
            <a 
              href="https://github.com/gzz727007/pdfseal/issues/new" 
              target="_blank" 
              class="flex-1 text-center bg-slate-900 text-white py-2 rounded-xl font-medium hover:bg-slate-800 transition"
            >
              {{ t('btn_github_issue') }}
            </a>
            <a 
              href="https://ko-fi.com/muffin27" 
              target="_blank" 
              class="flex-1 text-center bg-amber-500 text-white py-2 rounded-xl font-medium hover:bg-amber-600 transition"
            >
              {{ t('btn_kofi_message') }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { X } from 'lucide-vue-next';
import { t } from '../i18n';

defineProps({
  isOpen: Boolean
});

defineEmits(['close']);
</script>
