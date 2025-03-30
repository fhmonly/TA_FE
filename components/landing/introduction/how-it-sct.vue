<template>

    <!-- How It Works Section -->
    <section id="how-it-works" class="container py-20 bg-muted/50 rounded-lg my-10">
        <div class="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
            <p class="max-w-[85%] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our prediction platform is easy to use and delivers accurate results in just a few steps.
            </p>
        </div>
        <div class="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 md:gap-12 mt-16">
            <div class="flex flex-col items-center space-y-4 text-center">
                <div
                    class="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground">
                    1</div>
                <h3 class="text-xl font-bold">Input Your Data</h3>
                <p class="text-muted-foreground">Upload your historical data or connect to your data sources.</p>
            </div>
            <div class="flex flex-col items-center space-y-4 text-center">
                <div
                    class="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground">
                    2</div>
                <h3 class="text-xl font-bold">Select AI Model</h3>
                <p class="text-muted-foreground">Choose the prediction model that best fits your needs.</p>
            </div>
            <div class="flex flex-col items-center space-y-4 text-center">
                <div
                    class="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground">
                    3</div>
                <h3 class="text-xl font-bold">Get Predictions</h3>
                <p class="text-muted-foreground">Receive accurate predictions and actionable insights.</p>
            </div>
        </div>
    </section>

</template>