Integration of PowerTable with JavaScript frameworks is beyond the scope of this project. However, the example below demonstrates an easy approach to use PowerTable with React. 

<sup>The following is React's `src/App.js` file.</sup>

```javascript
import { useRef, useEffect } from 'react';
import { PowerTable } from '@muonw/powertable/package/dist/powertable.js'

let isLoaded = false;
let ptData = [{"id": 1, "name": "Fay"}, {"id": 2, "name": "Luca"}];
var myTable;

function App() {
  const tableRef = useRef(null);

  useEffect(() => {
    if (!isLoaded) {
      myTable = new PowerTable({
        target: tableRef.current,
        props: { ptData }
      });
      isLoaded = true;
    }
  },[]);

  return (<div ref={tableRef} />);
}

export default App;
```
