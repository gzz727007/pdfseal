<template>
  <footer class="bg-white border-t border-slate-200 py-8 text-center text-xs text-slate-500 mt-auto">
    <div class="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="flex items-center space-x-2">
        <span class="text-xl">🦭</span>
        <span class="font-bold text-slate-800">PDFSeal</span>
        <span>{{ t('brand_footer_claim') }}</span>
      </div>

      <div class="flex items-center space-x-5 font-medium">
        <a href="https://github.com/gzz727007/pdfseal" target="_blank" class="hover:text-slate-900 transition">GitHub</a>
        <a href="https://ko-fi.com/muffin27" target="_blank" class="text-amber-700 hover:text-amber-900 transition flex items-center space-x-1">
          <span>{{ t('footer_feed_seal') }}</span>
        </a>
        <button @click="$emit('open-feedback')" class="hover:text-slate-900 transition">{{ t('feedback_btn') }}</button>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { t } from '../i18n';
defineEmits(['open-feedback']);
</script>
