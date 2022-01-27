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
}

module.exports = new ApiFunction()
