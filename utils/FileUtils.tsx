
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export class FileUtils {
  public static async extractTextFromPDF(uri: string): Promise<string> {
    try {
      // For now, we'll return a placeholder since PDF text extraction
      // requires additional native modules
      const fileInfo = await FileSystem.getInfoAsync(uri);
      return `[PDF file: ${fileInfo.uri}]\nNote: PDF text extraction will be implemented with native modules.`;
    } catch (error) {
      console.error('PDF text extraction failed:', error);
      throw new Error('Failed to extract text from PDF');
    }
  }

  public static async readTextFile(uri: string): Promise<string> {
    try {
      return await FileSystem.readAsStringAsync(uri);
    } catch (error) {
      console.error('Text file reading failed:', error);
      throw new Error('Failed to read text file');
    }
  }

  public static async saveTextToFile(text: string, filename: string): Promise<string> {
    try {
      const fileUri = FileSystem.documentDirectory + filename;
      await FileSystem.writeAsStringAsync(fileUri, text);
      return fileUri;
    } catch (error) {
      console.error('File saving failed:', error);
      throw new Error('Failed to save file');
    }
  }

  public static async shareFile(uri: string, filename?: string): Promise<void> {
    try {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, { dialogTitle: filename });
      } else {
        throw new Error('Sharing is not available on this device');
      }
    } catch (error) {
      console.error('File sharing failed:', error);
      throw new Error('Failed to share file');
    }
  }

  public static getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || '';
  }

  public static isValidFileType(filename: string): boolean {
    const validExtensions = ['pdf', 'doc', 'docx', 'txt'];
    const extension = this.getFileExtension(filename);
    return validExtensions.includes(extension);
  }

  public static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
