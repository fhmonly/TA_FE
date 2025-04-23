export default defineAppConfig({
    ui: {
        slideover: {
            overlay: {
                transition: {
                    enter: 'ease-in-out duration-200',
                    leave: 'ease-in-out duration-200',
                }
            },
            width: 'w-screen max-w-sm',
        },
        modal: {
            container: 'flex min-h-full items-center justify-center text-center',
        }
    }
})
