The `userFunctions` property in `ptOptions` prop is an object that can contain the following user defined functions.

| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `dataFeed` | function | async () => ({}) | When `isDataRemote` is `true`, the output of this function will be used as `ptData` prop |
| `pageMod` | function | (d) => d | A user defined function to intercept and modify the content of the current page |


The value of `dataFeed` should be a function that returns remote data (e.g. from and API). The function will receive an object (defined below) containing the information required to generate the props. 

The function received the following object:

```
{
    options = ➤ current options (same structure as `ptOptions`),
    search: {
        isRegex: ➤ true or false (boolean),
        value: ➤ the search phrase (string)
    },
    filters: {
        [➤ `ptInstruct` key]: {
            isRegex: ➤ true or false (boolean),
            value: ➤ the filter phrase
        },
        ...
    }
}
```
and should return the following object:

```
{
    instructs: ➤ Instructs to be used (same structure as ptInstructs),
    options: ➤ Options to be used (same structure as ptOptions),
    data: ➤ Data of the current page. Should be already searched, filtered, and sorted (same structure as ptData)
}
```

The value of `pageMod` should a function that returns the modified content of the current page. The function will receive a slice of the `ptData` that contains the current page's data. 