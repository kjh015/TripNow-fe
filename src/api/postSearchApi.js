import apiClient from './client';
import { CATEGORY_LABEL_TO_CODE, REGION_LABEL_TO_CODE } from '../constants/categoryRegion';

// Swagger 기준 정렬 enum: ACCURACY, POPULAR, LATEST, STAR_AVG, VIEW_COUNT
const SORT_TYPE_MAP = {
  popular: 'POPULAR',
  modifiedDate: 'LATEST',
  ratingAvg: 'STAR_AVG',
  viewCount: 'VIEW_COUNT',
};

// 게시글 통합 검색
export const getPostListBySearch = ({ keyword, category, region, sort, direction, page, size } = {}) =>
  apiClient.get('/api/v1/search/posts', {
    params: {
      keyword,
      category: category ? (CATEGORY_LABEL_TO_CODE[category] ?? category) : undefined,
      region: region ? (REGION_LABEL_TO_CODE[region] ?? region) : undefined,
      sort: sort ? (SORT_TYPE_MAP[sort] ?? sort.toUpperCase()) : undefined,
      direction: direction ? direction.toUpperCase() : undefined,
      page,
      size,
    },
  });

// 게시글 상세 조회
export const getPost = (postId) =>
  apiClient.get(`/api/v1/search/posts/${postId}`);

// 내 게시글 검색
export const getMyPosts = ({ page, size } = {}) =>
  apiClient.get('/api/v1/search/posts/me', { params: { page, size } });

// 검색어 자동완성
export const autoCompleteSearch = (keyword, signal) =>
  apiClient.get('/api/v1/search/posts/autocomplete', { params: { keyword }, signal });
