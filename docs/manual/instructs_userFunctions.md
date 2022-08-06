The `userFunctions` property in `ptInstructs` prop is an object that can contain the following user defined function(s).

| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `customSort` | function | | Overrides the sorting process |
| `customFilter` | function | | A user defined function to override the filtering process |

The value of `customSort` should be a function that receives two string values (v1 and v2) and returns a number indicating the order of those values: `-1` if v1 < v2, `1` if v1 > v2, `0` if v1 == v2

The value of `customFilter` should be a function that returns a slice of `ptData` after applying a filter. The function will receive the `ptData`.