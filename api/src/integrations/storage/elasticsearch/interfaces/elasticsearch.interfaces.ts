export interface SearchQuery {
    q?: string;
    status?: string;
    min_score?: number;
    source_type?: string;
    tags?: string[];
    page?: number;
    limit?: number;
}

export interface SearchResult<T = Record<string, unknown>> {
    hits: T[];
    total: number;
}

export interface IndexMappings {
    properties: Record<string, unknown>;
}

export interface IndexParams<T extends Record<string, unknown>> {
    index: string;
    id: string;
    document: T;
    embeddingText?: string;
}
