import * as XLSX from 'xlsx';

export async function spreadsheetReader(file: File): Promise<XLSX.WorkSheet> {
    try {
        const fileBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(fileBuffer, {
            cellDates: true,
            type: 'array',
        });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        return worksheet;
    } catch (error: unknown) {
        throw error;
    }
}

export function sheet2HeaderNRow(worksheet: XLSX.WorkSheet) {
    const [headers, ...rows] = XLSX.utils.sheet_to_json<any[]>(worksheet, {
        raw: false,
        header: 1,
    });
    return {
        headers,
        rows
    };
}

export function headerNRow2Sheet(headers: any[], rows: any[][]) {
    return XLSX.utils.aoa_to_sheet([headers, ...rows]);
}

export function sheet2JSON<T = unknown>(worksheet: XLSX.WorkSheet) {
    return XLSX.utils.sheet_to_json<T>(worksheet, { defval: "" });
}

export function sheet2CSVFile(worksheet: XLSX.WorkSheet) {
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const csvBlob = new Blob([csv], { type: 'text/csv' });
    return new File([csvBlob], 'converted.csv', { type: 'text/csv' });
}
