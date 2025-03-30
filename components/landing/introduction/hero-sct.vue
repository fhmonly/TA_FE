<template>

    <!-- Hero Section -->
    <section class="container py-20 md:py-32">
        <div class="grid gap-10 md:grid-cols-2 md:gap-16">
            <div class="flex flex-col justify-center space-y-6 sm:pb-32">
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
                        class="inline-flex h-10 items-center justify-center rounded-md px-8 text-sm font-medium shadow">
                        Learn More
                    </NuxtUiButton>
                </div>
            </div>
            <div class="flex items-center justify-center">
                <div
                    class="relative h-[350px] w-[350px] rounded-full bg-gradient-to-r from-primary/20 to-primary/40 p-4">
                    <div class="absolute inset-0 flex items-center justify-center">
                        <div class="h-[250px] w-[250px] rounded-full bg-background p-4 shadow-lg">
                            <div
                                class="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-primary/30">
                                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round"
                                    stroke-linejoin="round" class="text-primary">
                                    <path d="M12 2v4"></path>
                                    <path d="M12 18v4"></path>
                                    <path d="m4.93 4.93 2.83 2.83"></path>
                                    <path d="m16.24 16.24 2.83 2.83"></path>
                                    <path d="M2 12h4"></path>
                                    <path d="M18 12h4"></path>
                                    <path d="m4.93 19.07 2.83-2.83"></path>
                                    <path d="m16.24 7.76 2.83-2.83"></path>
                                    <circle cx="12" cy="12" r="5"></circle>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>