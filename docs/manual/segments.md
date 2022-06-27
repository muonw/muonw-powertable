The `segments` property in `ptOptions` prop is an object that defines the top to bottom order of various HTML parts of PowerTable to facilitate theming and styling. Each property in this object will render a container DIV element with a `data-name` attribute equal to the property's arbitrary name and `data-type` equal to "segment". The value of each property is an array of HTML parts to be included in the container DIV element. Consider the following example:

```javascript
segments: {
    'myTopContainer': ['search', 'pagination'],
    'myTableContainer': ['table'],
}
```
That will translate to...

```html
<div data-name="myTopContainer" data-type="segment">
    [search bar HTML]
    [pagination HTML]
</div>

<div data-name="myTableContainer" data-type="segment">
    [table HTML]
</div>
```

The property names are arbitrary strings. The property values are as follows.

| value | Description |
| ----- | ----------- |
| "search" | Search bar |
| "pagination" | Pagination |
| "table" | The table block |
| "dropdown" | Dropdown menu for selecting the number of rows per page |
| "stats" | Representation of the displayed, filtered, and total number of rows |
| "settings" | Settings button |

The default value of `segments`:
```javascript
{
    'topBar': ['search', 'pagination'],
    'pTable': ['table'],
    'bottomBar': ['dropdown', 'stats', 'pagination'],
}
```