import * as XLSX from 'xlsx';

export async function sheetToJSON(file: File) {
    try {
        const fileBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(fileBuffer);
        const sheet = workbook.Sheets[workbook.SheetNames[0]]
        const json = XLSX.utils.sheet_to_json(sheet)
        return json
    } catch (error: unknown) {
        throw error
    }
}