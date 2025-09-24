export interface GoogleScholarResult {
  position: number;
  title: string;
  link?: string;
  snippet?: string;
  publication_info?: {
    summary: string;
  };
  inline_links?: {
    cited_by?: {
      total: number;
      link?: string;
    };
  };
  matched_author?: string;
  matched_authors?: string[];
  facultyId?: string;
}

export interface GoogleScholarResponse {
  organic_results: GoogleScholarResult[];
  search_information?: {
    total_results: number;
    query_displayed: string;
  };
  aggregated_metrics?: {
    totalPublications?: number;
    totalCitations?: number;
    averageCitations?: number;
  };
}
