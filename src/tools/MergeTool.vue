<template>
  <section class="tool-panel">
    <div class="mb-6 text-center max-w-xl mx-auto">
      <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{{ t('merge_title') }}</h2>
      <p class="text-sm text-slate-600 mt-1">{{ t('merge_desc') }}</p>
    </div>

    <!-- Dropzone -->
    <div 
      v-if="files.length === 0"
      @dragover.prevent="isDragOver = true"
      @dragleave.prevent="isDragOver = false"
      @drop.prevent="onDrop"
      :class="[
        'border-2 border-dashed rounded-3xl p-10 text-center transition cursor-pointer shadow-xs max-w-2xl mx-auto bg-white',
        isDragOver ? 'border-blue-500 bg-blue-50/50' : 'border-slate-300 hover:border-blue-500'
      ]"
      @click="fileInputRef.click()"
    >
      <input 
        ref="fileInputRef" 
        type="file" 
        multiple 
        accept="application/pdf" 
        class="hidden" 
        @change="onFileSelected"
      >
      <div class="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
        <Files class="w-8 h-8" />
      </div>
      <h3 class="text-base font-bold text-slate-800">{{ t('merge_drop_title') }}</h3>
      <p class="text-xs text-slate-500 mt-1">{{ t('merge_drop_subtitle') }}</p>
      <button 
        type="button" 
        class="mt-4 inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow-sm"
      >
        <Plus class="w-4 h-4" />
        <span>{{ t('btn_choose_files') }}</span>
      </button>
    </div>

    <!-- Workspace -->
    <div v-else class="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
      <div class="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h4 class="font-bold text-slate-800 text-sm">
            {{ t('merge_selected_title') }} ({{ files.length }})
          </h4>
          <p class="text-xs text-slate-500">{{ t('merge_selected_hint') }}</p>
        </div>
        <div class="flex items-center space-x-2">
          <button 
            @click="fileInputRef.click()" 
            class="text-xs text-blue-600 hover:text-blue-700 font-semibold px-2.5 py-1 rounded-lg hover:bg-blue-50 transition"
          >
            {{ t('btn_add_more') }}
          </button>
          <input 
            ref="fileInputRef" 
            type="file" 
            multiple 
            accept="application/pdf" 
            class="hidden" 
            @change="onFileSelected"
          >
          <button 
            @click="files = []" 
            class="text-xs text-rose-500 hover:text-rose-700 font-medium px-2.5 py-1 rounded-lg hover:bg-rose-50 transition"
          >
            {{ t('btn_clear_all') }}
          </button>
        </div>
      </div>

      <ul ref="listRef" class="divide-y divide-slate-100 my-4 max-h-96 overflow-y-auto pr-1">
        <li 
          v-for="(file, idx) in files" 
          :key="file.name + idx"
          class="py-3 px-3 flex items-center justify-between hover:bg-slate-50 rounded-xl transition cursor-grab active:cursor-grabbing"
        >
          <div class="flex items-center space-x-3 truncate">
            <GripVertical class="w-4 h-4 text-slate-400" />
            <FileText class="w-5 h-5 text-blue-500 shrink-0" />
            <div class="truncate">
              <p class="text-xs font-bold text-slate-800 truncate">{{ file.name }}</p>
              <p class="text-[10px] text-slate-400">{{ (file.size / (1024 * 1024)).toFixed(2) }} MB</p>
            </div>
          </div>
          <button 
            @click.stop="removeFile(idx)" 
            class="p-1 text-slate-400 hover:text-rose-600 rounded-lg transition"
          >
            <Trash2 class="w-4 h-4" />
          </button>
        </li>
      </ul>

      <!-- Action Button -->
      <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div class="text-xs text-slate-500 flex items-center">
          <Lock class="w-3.5 h-3.5 text-emerald-600 mr-1" />
          <span>{{ t('processed_locally') }}</span>
        </div>
        <button 
          :disabled="isProcessing"
          @click="executeMerge" 
          class="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition flex items-center space-x-2 shadow-md hover:shadow-blue-500/25 disabled:opacity-50"
        >
          <span v-if="!isProcessing">{{ t('seal_and_merge') }}</span>
          <span v-else>Sealing...</span>
          <Download v-if="!isProcessing" class="w-4 h-4" />
          <Loader2 v-else class="w-4 h-4 animate-spin" />
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from 'vue';
import { Files, Plus, GripVertical, FileText, Trash2, Lock, Download, Loader2 } from 'lucide-vue-next';
import { PDFDocument } from 'pdf-lib';
import Sortable from 'sortablejs';
import { t, currentLang } from '../i18n';
import { triggerDownload } from '../utils/download';

const fileInputRef = ref(null);
const listRef = ref(null);
const files = ref([]);
const isDragOver = ref(false);
const isProcessing = ref(false);
let sortableInstance = null;

function onFileSelected(e) {
  addFiles(e.target.files);
  e.target.value = '';
}

function onDrop(e) {
  isDragOver.value = false;
  addFiles(e.dataTransfer.files);
}

function addFiles(newFiles) {
  for (const f of newFiles) {
    if (f.type === 'application/pdf' || f.name.endsWith('.pdf')) {
      files.value.push(f);
    }
  }
}

function removeFile(index) {
  files.value.splice(index, 1);
}

watch(files, () => {
  nextTick(() => {
    if (listRef.value && !sortableInstance) {
      sortableInstance = new Sortable(listRef.value, {
        animation: 150,
        ghostClass: 'ghost-card',
        onEnd: (evt) => {
          const item = files.value.splice(evt.oldIndex, 1)[0];
          files.value.splice(evt.newIndex, 0, item);
        }
      });
    }
  });
}, { deep: true });

async function executeMerge() {
  if (files.value.length < 2) {
    alert(currentLang.value === 'zh' ? '请至少选择 2 个 PDF 文件进行合并。' : 'Please select at least 2 PDF files to merge.');
    return;
  }

  isProcessing.value = true;
  try {
    const mergedPdf = await PDFDocument.create();
    for (const file of files.value) {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach(p => mergedPdf.addPage(p));
    }
    const mergedBytes = await mergedPdf.save();
    triggerDownload(new Blob([mergedBytes], { type: 'application/pdf' }), `PDFSeal_Merged_${Date.now()}.pdf`);
  } catch (err) {
    console.error(err);
    alert('Failed to merge PDFs: ' + err.message);
  } finally {
    isProcessing.value = false;
  }
}
</script>
