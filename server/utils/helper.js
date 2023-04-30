const skipCount = (query) => {
    let count = 0;
    if(query.page) {
        count = query.page <= 0 || query.page == 1 ? 0 : (query.page * process.env.COUNT) - process.env.COUNT 
    }else {
        count = 0;
    }
    console.log(count)
    return count;
}

module.exports = {skipCount}