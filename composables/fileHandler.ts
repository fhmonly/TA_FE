export function useFileHandler() {
    const file = ref()
    function onDragHandler(e: DragEvent) {
        e.preventDefault();
        const files = e.dataTransfer?.files;
        if (files && files.length > 0) {
            file.value = files[0]
        }
    }
    function onInputHandler(e: Event) {
        const target = e.target as HTMLInputElement
        if (target?.files && target.files.length > 0) {
            const uploaded = target.files[0];
            file.value = uploaded;
        }
    }
    return { file, onDragHandler, onInputHandler }
}