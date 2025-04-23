<template>

    <!-- Footer -->
    <footer class="border-t bg-background">
        <div class=" flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
            <div class="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                <NuxtImg src="assets/icons/logo.png" format="webp" height="24" width="auto" />
                <p class="text-center text-sm leading-loose text-muted-foreground md:text-left">
                    © 2025 StokIn. All rights reserved.
                </p>
            </div>
            <div class="flex gap-4">
                <a href="#" class="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                    Terms
                </a>
                <a href="#" class="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                    Privacy
                </a>
                <a href="#" class="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                    Contact
                </a>
            </div>
        </div>
    </footer>
</template>