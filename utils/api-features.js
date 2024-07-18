class ApiFeatures {

  // THIS FUNCTION WILL BE CALLED FIRST

  constructor(query, queryString) {

    // QUERY WILL HAVE MONGOOSE RESULT OF QUERY

    this.query = query;

    // QUERY STRING COMMING FROM POSTMAN WILL BE HERE

    this.queryString = queryString;
  }

  // SEARCH BAR
  
  search() {

    // EITHER KEYWORD WILL BE EMPTY OBJECT OR IT WILL BE QUERY
    // WRITTEN BY USER

    const keyword = this.queryString.keyword
      ? { name: { $regex: this.queryString.keyword, $options : "i" } }
      : {};
      
      // FIND THIS KEYWORD IN MONGOOSE

      this.query = this.query.find({...keyword});

      return this;
  }

  filter()
  {
    //COPY QUERY STRING IN CONSTANT

    const queryCopy = {...this.queryString};

    // FILTER FOR CATEGORY

    const removeFields = ["keyword","page","limit"];

    removeFields.forEach(key => delete queryCopy[key]);

    // FILTER FOR PRICE 
    
    let queryStr = JSON.stringify(queryCopy);

    queryStr = queryStr.replace(/\b(gt|gte|lte|lt)\b/g,(key)=> `$${key}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  pagination(resultPerPage)
  {
    const currentPage = Number(this.queryString.page) ||  1;

    // TELLS HOW MANY PRODUCTS SHOULD WE SKIP EG IN PAGE 1
    // 10*(1-1)= 0 SO WE WILL SKIP NO PRODUCT BUT IN PAGE 2 
    // WE WILL SKIP 20

    const skip = resultPerPage * (currentPage -1);

    // .LIMIT AND .SKIP ARE MONGOOSE OPERATOR TO SHOW LIMITED
    //  RESULTS BY SKIPPING NEXT PRODUCTS

    this.query = this.query.limit(resultPerPage).skip(skip);

    return this;
  }
}

module.exports = ApiFeatures;
