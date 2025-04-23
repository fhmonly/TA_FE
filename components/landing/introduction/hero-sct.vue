<template>
    <section class="mt-20 pb-20 md:mt-32 md:pb-32 mx-auto min-h-screen flex gap-3 flex-col sm:flex-row">
        <div class="flex flex-col justify-center space-y-6 sm:w-[60%] py-10">
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
                    Try Demo
                </NuxtUiButton>
                <NuxtUiButton variant="outline" color="white"
                    class="inline-flex h-10 items-center justify-center rounded-md px-8 text-sm font-medium shadow"
                    to="/#how-it-works">
                    Learn More
                </NuxtUiButton>
            </div>
        </div>
        <Placeholder class="aspect-video flex-grow bg-gray-500" />
    </section>
</template>
<style>
:root {
    scroll-behavior: smooth;
}
</style>