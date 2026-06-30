"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPagination = getPagination;
exports.buildPaginationMeta = buildPaginationMeta;
function getPagination(page, limit) {
    const currentPage = Math.max(Number(page) || 1, 1);
    const pageLimit = Math.max(Number(limit) || 10, 1);
    const offset = (currentPage - 1) * pageLimit;
    return { currentPage, pageLimit, offset };
}
function buildPaginationMeta(currentPage, pageLimit, totalItem) {
    return {
        currentPage,
        totalPage: Math.ceil(totalItem / pageLimit),
        totalItem,
        limit: pageLimit
    };
}
