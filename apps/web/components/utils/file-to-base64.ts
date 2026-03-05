export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        // Use the full Data URL (includes the mime type)
        resolve(reader.result);
      } else {
        reject(new Error("File could not be read as a base64 string."));
      }
    };
    reader.onerror = () => reject(new Error("File reading failed."));
    reader.readAsDataURL(file);
  });
}
