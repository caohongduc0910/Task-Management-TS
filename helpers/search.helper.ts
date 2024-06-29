interface SearchObject {
  keyword: string,
  regex?: RegExp
}

const searchHelper = (query: Record <string, any>): SearchObject => {
  
  const searchObject: SearchObject = {
    keyword: ''  
  }

  if (query.keyword) {
    searchObject.keyword = query.keyword
    const regex: RegExp = new RegExp(searchObject.keyword, "i") //Search without Case sensitive
    searchObject.regex = regex
  }

  return searchObject
}

export default searchHelper