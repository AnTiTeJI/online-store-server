class ApiFunction {
    findDuplicateOnArray(arr: string[]) {
        let errors: string[] = [];
        arr = arr.filter((item, index) => {
            if (arr.indexOf(item) !== index)
                errors.push(item);
        });
        if (errors.length)
            return errors;
    }
}

export = new ApiFunction();
