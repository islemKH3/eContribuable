export interface FileDetailsDTO {
    id: number;
    fileName: string;
    fileType: string;
    fileData: string;
    ocrText?: string;
    valeurs?: { [key: string]: string};
}

export class FileDetailsDTO {
    constructor(
        public id: number,
        public fileName: string,
        public fileType: string,
        public fileData: string,
        public ocrText?: string,
        public valeurs?: { [key: string]: string}
    ) {}

    toBlob(): Blob {
        const byteCharacters = atob(this.fileData);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: this.fileType});
    }
}