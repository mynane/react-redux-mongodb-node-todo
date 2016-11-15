var formatQuery = function(queryObj, allowObj){
    var result = {};
    for(var index in queryObj){
        var item = queryObj[index];
        var allow = allowObj[index];
        if(allow){
            result[allow] = item;
        }
    }

    return result;
}

module.exports = formatQuery;