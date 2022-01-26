class ApiFunction {
    findDuplicateOnArray(arr) {
        let errors = []
        arr = arr.filter((item, index) => {
            if (arr.indexOf(item) !== index)
                errors.push(item)
        })
        if (errors.length)
            return errors
        return false
    }
    CalculateOffset(page = 1, limit = 10) {
        return {
            offset: (page || 1) * (limit || 10) - (limit || 10),
            limit: limit || 10
        }
    }
}

module.exports = new ApiFunction()
