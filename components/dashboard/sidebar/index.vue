<script setup lang="ts">
import { GalleryVerticalEnd } from 'lucide-vue-next'
import type { SidebarProps } from '~/components/ui/sidebar';
const props = defineProps<SidebarProps>()
// This is sample data.
const data = {
    navMain: [
        {
            title: 'Getting Started',
            url: '#',
            items: [
                {
                    title: 'Installation',
                    url: '#',
                },
                {
                    title: 'Project Structure',
                    url: '#',
                },
            ],
        },
        {
            title: 'Building Your Application',
            url: '#',
            items: [
                {
                    title: 'Routing',
                    url: '#',
                },
                {
                    title: 'Data Fetching',
                    url: '#',
                    isActive: true,
                },
                {
                    title: 'Rendering',
                    url: '#',
                },
                {
                    title: 'Caching',
                    url: '#',
                },
                {
                    title: 'Styling',
                    url: '#',
                },
                {
                    title: 'Optimizing',
                    url: '#',
                },
                {
                    title: 'Configuring',
                    url: '#',
                },
                {
                    title: 'Testing',
                    url: '#',
                },
                {
                    title: 'Authentication',
                    url: '#',
                },
                {
                    title: 'Deploying',
                    url: '#',
                },
                {
                    title: 'Upgrading',
                    url: '#',
                },
                {
                    title: 'Examples',
                    url: '#',
                },
            ],
        },
        {
            title: 'API Reference',
            url: '#',
            items: [
                {
                    title: 'Components',
                    url: '#',
                },
                {
                    title: 'File Conventions',
                    url: '#',
                },
                {
                    title: 'Functions',
                    url: '#',
                },
                {
                    title: 'next.config.js Options',
                    url: '#',
                },
                {
                    title: 'CLI',
                    url: '#',
                },
                {
                    title: 'Edge Runtime',
                    url: '#',
                },
            ],
        },
        {
            title: 'Architecture',
            url: '#',
            items: [
                {
                    title: 'Accessibility',
                    url: '#',
                },
                {
                    title: 'Fast Refresh',
                    url: '#',
                },
                {
                    title: 'Next.js Compiler',
                    url: '#',
                },
                {
                    title: 'Supported Browsers',
                    url: '#',
                },
                {
                    title: 'Turbopack',
                    url: '#',
                },
            ],
        },
        {
            title: 'Community',
            url: '#',
            items: [
                {
                    title: 'Contribution Guide',
                    url: '#',
                },
            ],
        },
    ],
}
</script>
<template>
    <ShadSidebar v-bind="props">
        <ShadSidebarHeader>
            <ShadSidebarMenu>
                <ShadSidebarMenuItem>
                    <ShadSidebarMenuButton size="lg" as-child>
                        <a href="#">
                            <div
                                class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                <GalleryVerticalEnd class="size-4" />
                            </div>
                            <div class="flex flex-col gap-0.5 leading-none">
                                <span class="font-semibold">Documentation</span>
                                <span class="">v1.0.0</span>
                            </div>
                        </a>
                    </ShadSidebarMenuButton>
                </ShadSidebarMenuItem>
            </ShadSidebarMenu>
        </ShadSidebarHeader>
        <ShadSidebarContent>
            <ShadSidebarGroup>
                <ShadSidebarMenu>
                    <ShadSidebarMenuItem v-for="item in data.navMain" :key="item.title">
                        <ShadSidebarMenuButton as-child>
                            <a :href="item.url" class="font-medium">
                                {{ item.title }}
                            </a>
                        </ShadSidebarMenuButton>
                        <ShadSidebarMenuSub v-if="item.items.length">
                            <ShadSidebarMenuSubItem v-for="childItem in item.items" :key="childItem.title">
                                <ShadSidebarMenuSubButton as-child :is-active="childItem.isActive">
                                    <a :href="childItem.url">{{ childItem.title }}</a>
                                </ShadSidebarMenuSubButton>
                            </ShadSidebarMenuSubItem>
                        </ShadSidebarMenuSub>
                    </ShadSidebarMenuItem>
                </ShadSidebarMenu>
            </ShadSidebarGroup>
        </ShadSidebarContent>
        <SidebarRail />
    </ShadSidebar>
</template>