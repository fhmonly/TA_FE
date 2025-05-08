<!-- components/UiConfirmModal.vue -->
<template>
    <NuxtUiModal v-model="modelValue">
        <NuxtUiCard>
            <!-- Slot header -->
            <template #header>
                <slot name="header">
                    <h3 class="text-lg font-semibold">Confirmation</h3>
                </slot>
            </template>

            <!-- Slot body / default -->
            <template #default>
                <slot>
                    <p>Are you sure to continue this action?</p>
                </slot>
            </template>

            <!-- Slot footer -->
            <template #footer>
                <slot name="footer">
                    <div class="flex justify-end gap-2">
                        <NuxtUiButton color="red" variant="soft" @click="emit('cancel')">Cancel</NuxtUiButton>
                        <NuxtUiButton color="green" :loading="loading" @click="emit('confirm')">Confirm</NuxtUiButton>
                    </div>
                </slot>
            </template>
        </NuxtUiCard>
    </NuxtUiModal>
</template>

<script setup lang="ts">
const modelValue = defineModel<boolean>();
const props = defineProps<{ loading?: boolean }>();
const emit = defineEmits<{
    (e: 'confirm'): void;
    (e: 'cancel'): void;
}>();
</script>
