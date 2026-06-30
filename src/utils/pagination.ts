export function getPagination(page?:string,limit?:string){
  const currentPage = Math.max(Number(page) || 1,1);
  const pageLimit = Math.max(Number(limit) || 10,1);
  const offset = (currentPage-1)*pageLimit;
  
  return {currentPage,pageLimit,offset};
}

export function buildPaginationMeta(currentPage:number,pageLimit:number,totalItem:number){
return {
  currentPage,
  totalPage:Math.ceil(totalItem/pageLimit),
  totalItem,
  limit:pageLimit
}
}