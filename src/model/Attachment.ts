export default interface Attachment {
  id: string;
  /** Whether the attachment should be previewed as an image */
  isImage: boolean;
  /** The size of the attachment, in bytes. May be `undefined` if not known. */
  size?: number;
  /** The MIME type of the attachment. May be a wildcard, like `image/*` */
  mime: string;
  /**
   * The download URL of the attachment. Images, PDFs, etc. must not have their
   * `Content-Disposition` set to `attachment` so they can be previewed. May be
   * undefined if image is still uploading or an error occurred.
   */
  url?: string;
  /** The name of the file/image. */
  name: string;
  /** Whether the file has an error on the uploading side. */
  hasError: boolean;
}
