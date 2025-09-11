import {
  Analytic,
  AnalyticPoint,
  AnalyticRoom,
  DocumentType,
  ScoreCategory,
} from "@/types/supabase";

export interface OpenAIAnalayzedResponse {
  score: number;
  score_category: ScoreCategory;
  document_type: DocumentType;
  points: AnalyticPoint[];
  china_data_processing_details?: string | null;
  summary: string;
  title: string | null;
}

export interface OpenAIValidationResponse {
  language: string;
  document_type: DocumentType;
}

export interface AnalysisResultRes<T> {
  isSuccess: boolean;
  message: string;
  result?: T;
}

export interface SSEResponse {
  status: SSEStatus;
  analytic?: Analytic;
  room?: AnalyticRoom;
}

export type SSEStatus = "fetching" | "analyzing" | "done" | "error";
