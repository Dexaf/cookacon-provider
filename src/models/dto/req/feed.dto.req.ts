export interface SearchSuggestionDtoReq {
  searchInput: string;
}

export interface SearchDtoReq {
  quantity?: number;
  page: number;
}

export interface SearchByTitleReq {
  searchInput: string;
  quantity?: number;
  page: number;
}