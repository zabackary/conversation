import { SymbolCodepoints } from "react-material-symbols/dist/types";

export const MIME_ICON_MAPPING: Record<string, SymbolCodepoints> = {
  "image/*": "image",
  "audio/*": "music_note",
  "video/*": "movie",
  "font/*": "font_download",
  "image/gif": "gif",
  "application/pdf": "picture_as_pdf",
  "application/msword": "article",
  "application/vnd.ms-word": "article",
  "application/vnd.oasis.opendocument.text": "article",
  "application/vnd.openxmlformats-officedocument.wordprocessingml": "article",
  "application/vnd.ms-excel": "table",
  "application/vnd.openxmlformats-officedocument.spreadsheetml": "table",
  "application/vnd.oasis.opendocument.spreadsheet": "table",
  "text/csv": "table",
  "text/tab-separated-values": "table",
  "application/vnd.ms-powerpoint": "slideshow",
  "application/vnd.openxmlformats-officedocument.presentationml": "slideshow",
  "application/vnd.oasis.opendocument.presentation": "slideshow",
  "text/plain": "description",
  "text/html": "html",
  "text/javascript": "javascript",
  "text/css": "css",
  "application/x-httpd-php": "php",
  "application/atom+xml": "rss_feed",
  "application/rss+xml": "rss_feed",
  "application/vnd.apple.installer+xml": "terminal",
  "application/x-msdownload": "terminal",
  "application/vnd.microsoft.portable-executable": "terminal",
  "application/json": "code",
  "text/xml": "code",
  "application/xml": "code",
  "application/zip": "folder_zip",
  "application/x-7z-compressed": "folder_zip",
  "application/x-freearc": "folder_zip",
  "application/x-bzip": "folder_zip",
  "application/x-bzip2": "folder_zip",
  "application/gzip": "folder_zip",
  "application/vnd.rar": "folder_zip",
  "application/x-tar": "folder_zip",
  "text/*": "text_snippet",
};

export default function mimeToIcon(mime: string): SymbolCodepoints {
  return (
    MIME_ICON_MAPPING[mime] ||
    MIME_ICON_MAPPING[`${mime.split("/")[0] ?? ""}/*`] ||
    "draft"
  );
}
