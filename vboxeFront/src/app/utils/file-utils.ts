import * as fileSaver from 'file-saver';
export const exportFile = (
    file: Blob,
    fileName: string,
    typeFile: string,
    action: string
  ) => {
    if (!typeFile) {
      return null;
    }
  
    const blob = new Blob([file], { type: typeFile });
  //(window.navigator as any).msSaveOrOpenBlob(data, filename);
    if (false && window.navigator && window.navigator as any) {
      if (action === 'VIEWS') {
        (window.navigator as any).msSaveOrOpenBlob(blob);
      } else {
        console.log((window.navigator as any).msSaveBlob)
        if((window.navigator as any).msSaveBlob != undefined)
        (window.navigator as any).msSaveBlob(blob, sanitizeFilenameFromString(fileName));
      }
    } else {
      if (action === 'VIEWS') {
        const fileURL = URL.createObjectURL(blob);
        if (typeFile === 'application/image') openImageOnNewTab(fileURL);
        else window.open(fileURL, '_blank');
        return;
      } else {
        return fileSaver.saveAs(blob, sanitizeFilenameFromString(fileName));
      }
    }
  };
  
  function openImageOnNewTab(imageURL) {
    const image = new Image();
    image.src = imageURL;
  
    const w = window.open('', '_blank');
    w.document.write(image.outerHTML);
    w.document.close();
  }
  
  export const sanitizeFilenameFromString = (
    filename: string,
    replaceChar: string = '-'
  ): string => {
    return filename.replace(/[/\\?%*:|"<>]/g, replaceChar);
  };
  