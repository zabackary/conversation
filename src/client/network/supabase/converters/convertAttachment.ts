import { Attachment } from "../../../../model/message";
import { SupabaseAttachment } from "../cache";

export default function convertAttachment(
  dbAttachment: SupabaseAttachment
): Attachment {
  return {
    id: dbAttachment.id,
    isImage: dbAttachment.as_image,
    mime: dbAttachment.mime_type,
    url: dbAttachment.upload_url ?? undefined,
    name: dbAttachment.name,
    hasError: dbAttachment.has_error,
  };
}
