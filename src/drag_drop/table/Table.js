import React, { useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine-dark.css';

function GenerateTable(props) {

  const gridRef = useRef();

  const robots = ['R2-D2', 'C-3PO', 'BB-8', 'L3-37', 'K-2SO', 'IG-11']; // replace with backend endpoint

  const defaultColDef = {
    editable: true,
    resizable: true
  }

  const columnDefs = [
      { field: 'ID', rowDrag: true, editable: false },
      { field: 'x' },
      { field: 'y' },
      { field: 'z' },
      { field: 'roll' },
      { field: 'pitch' },
      { field: 'yaw' },
      { field: 'robot', cellEditor: 'agSelectCellEditor', singleClickEdit: true, cellEditorParams: { values: robots } }
  ];

  const rowData = props.data;

  function handleOnSubmit(){
    console.log(gridRef.current.api.getDataAsCsv());  // replace with backend endpoint that provides error message for invalid input
  }

  return (
    <React.Fragment>
      <div className="ag-theme-alpine-dark" style={{ width: '100%', height: 400 }}>
          <AgGridReact
              ref={gridRef}
              rowData={rowData}
              defaultColDef={defaultColDef}
              columnDefs={columnDefs}
              rowDragManaged={true}
              onGridReady={(e) => e.api.sizeColumnsToFit()}
          />
       </div>
      <button onClick={handleOnSubmit}>Submit</button>
    </React.Fragment>
  );

}

export default GenerateTable;
