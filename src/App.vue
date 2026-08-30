<template>
  <div class="min-h-screen flex flex-col justify-between">
    <!-- Offline Bar -->
    <div 
      v-if="!isOnline" 
      class="bg-emerald-700 text-white text-xs py-1.5 px-4 text-center font-medium shadow-sm transition-all"
    >
      <span>{{ t('offline_banner') }}</span>
    </div>

    <!-- Header Navbar -->
    <Navbar 
      :active-tab="activeTab" 
      @switch-tab="activeTab = $event" 
      @open-feedback="isFeedbackOpen = true" 
    />

    <!-- Main Workspace -->
    <main class="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
      <KeepAlive>
        <component :is="activeToolComponent" />
      </KeepAlive>
    </main>

    <!-- Footer -->
    <Footer @open-feedback="isFeedbackOpen = true" />

    <!-- Feedback Modal -->
    <FeedbackModal 
      :is-open="isFeedbackOpen" 
      @close="isFeedbackOpen = false" 
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
import FeedbackModal from './components/FeedbackModal.vue';

import MergeTool from './tools/MergeTool.vue';
import OrganizeTool from './tools/OrganizeTool.vue';
import SplitTool from './tools/SplitTool.vue';
import WatermarkTool from './tools/WatermarkTool.vue';
import SanitizeTool from './tools/SanitizeTool.vue';
import { t } from './i18n';

const activeTab = ref('merge');
const isFeedbackOpen = ref(false);
const isOnline = ref(navigator.onLine);

const toolComponents = {
  merge: MergeTool,
  organize: OrganizeTool,
  split: SplitTool,
  watermark: WatermarkTool,
  sanitize: SanitizeTool,
};

const activeToolComponent = computed(() => toolComponents[activeTab.value] || MergeTool);

function updateOnlineStatus() {
  isOnline.value = navigator.onLine;
}

onMounted(() => {
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
});

onUnmounted(() => {
  window.removeEventListener('online', updateOnlineStatus);
  window.removeEventListener('offline', updateOnlineStatus);
});
</script>
