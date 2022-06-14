import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine-dark.css';

function GenerateTable(props) {

  const [columnDefs] = useState([
      { field: 'ID', rowDrag: true },
      { field: 'X' },
      { field: 'Y' },
      { field: 'Z' },
      { field: 'Roll' },
      { field: 'Pitch' },
      { field: 'Yaw' }
  ]);

  const [rowData] = useState([
    { ID: 'John', X: 28, Y: 'some where else', Z: '1', Roll: '1', Pitch: '1', Yaw: '1' },
    { ID: 'Jack', X: 28, Y: 'some where', Z: '1', Roll: '1', Pitch: '1', Yaw: '1' },
    { ID: 'Elice', X: 28, Y: 'some where', Z: '1', Roll: '1', Pitch: '1', Yaw: '1' },
  ]);

  //var table = React.createRef();

  function handleOnSubmit(){
    //var doc = read(table, { type: 'string' })
    //console.log(doc);
  }

  return (
    <React.Fragment>
      <div className="GeneratedTable" dangerouslySetInnerHTML={{__html: props.data}} />
      <div className="ag-theme-alpine-dark" style={{height: 400, width: '100%'}}>
           <AgGridReact
               rowData={rowData}
               columnDefs={columnDefs}
               rowDragManaged={true}>
           </AgGridReact>
       </div>
      <button onClick={handleOnSubmit}>Submit</button>
    </React.Fragment>
  );

}

export default GenerateTable;