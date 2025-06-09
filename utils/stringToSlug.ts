export function stringToSlug(text: string): string {
    return text
        .toLowerCase()
        .normalize("NFD")                     // pisahin aksen (misal é -> e + ́)
        .replace(/[\u0300-\u036f]/g, "")      // hapus aksen
        .replace(/[^a-z0-9\s-]/g, "")         // hapus simbol aneh
        .trim()                               // hapus spasi depan/belakang
        .replace(/\s+/g, "-")                 // spasi -> dash
        .replace(/-+/g, "-");                 // dash ganda -> satu
}