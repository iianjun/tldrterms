import { DocumentType } from "@/types/supabase";

export const DOCUMENT_TYPE_TITLE_MAP: Record<DocumentType, string> = {
  terms: "Terms & Conditions",
  privacy: "Privacy Policy",
  unknown: "Unknown",
};
