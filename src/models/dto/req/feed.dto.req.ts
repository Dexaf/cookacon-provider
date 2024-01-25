export interface SearchSuggestionDtoReq {
  searchInput: string;
  includeQuarters: boolean
}

export interface SearchDtoReq {
  quantity?: number;
  page: number;
}