class ApiFeatures{

    constructor(query, queryStr){   // queryStr ekhane keyword. jeta diye product search korbe user, ar query holo get all products jeta productcontroller e ase

        this.query = query;
        this.queryStr = queryStr
    }

    search(){

        const keyword= this.queryStr.keyword 
          ? {                                     //// keyword pelam kina, jeta user search korbe

              name: {
                $regex: this.queryStr.keyword,  // regex mongofb er operator
                $options: "i",   // etar diye ensure korlam capital, small letter jate effect na kore, case insensitive
                
              },
            }
          : {};  
        
        

        this.query = this.query.find({...keyword});   //productcontroller er get all products er productfind function e keyword pathalam
        return this;   // ei class abr return kore dilam
    }

    filter() {

      const queryCopy = { ...this.queryStr };    // upor theke query copy korlam. {...} deyar reason holo jate reference create hoye na jay, tkhn ekta change korle onnotao change hoto

      // Remove fields that are not part of filter
      const removeFields = ["keyword", "page", "limit"];   // filter e keyword, page, limit chai na, tai eder arr banay delete kore dilam

      removeFields.forEach(key => delete queryCopy[key]);   // key= keyworf, page thakle ta delete hoye jbe

    
      // filter for price and rating

      // Convert queryCopy into a MongoDB-compatible query object, karon  price holo number but amra str kore rekhechi

      const filterQuery = {};

      Object.keys(queryCopy).forEach(key => {
        if (key.includes("[")) {
            const [field, operator] = key.split(/\[|\]/).filter(Boolean); // e.g. "price[gte]" => ["price", "gte"]
            if (!filterQuery[field]) filterQuery[field] = {};
            filterQuery[field][`$${operator}`] = Number(queryCopy[key]); // convert to number if needed
        } else {
            filterQuery[key] = queryCopy[key];
        }

      });

      this.query = this.query.find(filterQuery);   // str theke abr object kore dilam
      return this;

    }

    pagination(resultPerPage){      // resultPerPage = 5 , controller e, per page e 5 ta product dekhabe

      const currentPage = Number(this.queryStr.page) || 1;  // postman e page er value 2 dile querystr hbe 2, kichu na dile 1 dhorbe. str howay number e convert kora holo

      const skip = resultPerPage * (currentPage-1) // product 50 ta, per page 10 ta kre show jdi kori, taile 2nd page e 1st 10 ta product skip kra lgbe, eta ei eqn diye kora hoy  
      
      this.query = this.query.limit(resultPerPage).skip(skip);  // per page e limit= result per page, eei sokgkhok product dekhabo, r skip func er vitor koyta skip krbo ta diye dilam

      return this;
    }

}

module.exports = ApiFeatures;