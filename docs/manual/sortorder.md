The `sortOrder` property in `ptOptions` prop is an object that specifies how the sorting direction will change. The property names represent the sorting direction before the click and their values represent the sorting direction after the click. When the value is an empty string, no sorting will be applied.

| name/value | Description |
| ----- | ----------- |
| "asc" | Ascending (small to large) |
| "desc" | Descending (large to small) |
| "" | No sorting |

The default value of `sortOrder`:
```javascript
{
    '': 'asc',
    'asc': 'desc',
    'desc': '',
}
```