interface ObjectPagination {
  limit: number,
  currentPage: number,
  skipItem: number,
  totalPages?: number
}

const paginationHelper = (query: Record<string, any>, count: number): ObjectPagination => {
  const objectPagination: ObjectPagination = {
    limit: 2,
    currentPage: 1,
    skipItem: 0
  }

  if (query.index) {
    objectPagination.currentPage = parseInt(query.index)
  }

  if (query.limit) {
    objectPagination.limit = parseInt(query.limit)
  }

  objectPagination.skipItem = (objectPagination.currentPage - 1) * objectPagination.limit
  objectPagination.totalPages = Math.ceil(count / objectPagination.limit)

  return objectPagination
}

export default paginationHelper