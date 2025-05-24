<template>
    <!-- CTA Section -->
    <section class=" py-20">
        <div class="mx-auto max-w-4xl rounded-lg p-8 md:p-12">
            <div class="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
                <div class="space-y-2">
                    <h2 class="text-3xl font-bold tracking-tighter text-primary-foreground sm:text-4xl">Ready to
                        start predicting?</h2>
                    <p class="text-primary-foreground/80 md:text-lg">
                        Try our demo today and see the power of AI predictions.
                    </p>
                </div>
                <NuxtUiButton color="green"
                    class="h-10 items-center justify-center rounded-md px-8 text-sm font-medium shadow " to="/demo">
                    <span>
                        {{ authState === 'logged-in' ? 'Dashboard' : 'Try Demo' }}

                    </span>
                </NuxtUiButton>
            </div>
        </div>
    </section>
</template>
<script lang="ts" setup>
const {
    authState
} = useMyAppState()
</script>