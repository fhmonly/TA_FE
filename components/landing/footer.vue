<template>

    <!-- Footer -->
    <footer class="border-t bg-background">
        <div class=" flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
            <div class="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                <div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="text-primary-foreground">
                        <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"></path>
                        <path d="M21 3v5h-5"></path>
                    </svg>
                </div>
                <p class="text-center text-sm leading-loose text-muted-foreground md:text-left">
                    © 2025 SmartLog. All rights reserved.
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