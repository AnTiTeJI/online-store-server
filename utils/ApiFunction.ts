class ApiFunction {
  findDuplicateOnArray(arr: string[]) {
    let errors: string[] = [];
    arr = arr.filter((item, index) => {
      if (arr.indexOf(item) !== index) errors.push(item);
    });
    if (errors.length) return errors;
  }
  isStringArray(object: any): object is string[] {
    return object;
  }
}

export = new ApiFunction();
