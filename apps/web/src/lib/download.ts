/** Saves text as a file in the browser. A leading BOM keeps Excel from misreading euro signs and accents in CSV. */
export function downloadTextFile(filename: string, content: string, mime = 'text/csv;charset=utf-8') {
    const blob = new Blob(['\ufeff', content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}
