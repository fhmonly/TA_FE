<template>
    <section class="mx-auto md:min-h-screen flex gap-3 flex-col md:flex-row md:py-10">
        <div class="flex flex-col justify-center space-y-6 md:w-[60%] py-10 tablet:py-20">
            <div class="space-y-2">
                <h1 class="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                    Predict the Future with ARIMA
                </h1>
                <p class="text-lg text-muted-foreground md:text-xl">
                    Harness the power of ARIMA to make accurate predictions and informed decisions.
                </p>
            </div>
            <div class="flex flex-col gap-2 min-[400px]:flex-row">
                <NuxtUiButton
                    class="inline-flex h-10 items-center justify-center rounded-md px-8 text-sm font-medium shadow"
                    to="/demo">
                    {{ authState === 'logged-in' ? 'Dashboard' : 'Try Demo' }}
                </NuxtUiButton>
                <NuxtUiButton variant="outline" color="white"
                    class="inline-flex h-10 items-center justify-center rounded-md px-8 text-sm font-medium shadow"
                    to="/#how-it-works">
                    Learn More
                </NuxtUiButton>
            </div>
        </div>
        <NuxtImg src="https://placehold.co/600x400/png" format="webp" class="grow" />
    </section>
</template>
<script lang="ts" setup>
const {
    authState
} = useMyAppState()
</script>
<style>
:root {
    scroll-behavior: smooth;
}
</style>