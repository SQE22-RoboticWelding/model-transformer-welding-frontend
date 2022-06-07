import React from 'react';
import { read } from 'xlsx';

function Table(props) {

  function handleOnSubmit(){
    var doc = read(Table, { type: 'string' })
    console.log(doc);
  }

  return (
    <React.Fragment>
      <div className="Table" dangerouslySetInnerHTML={{__html: props.data}} />
      <button onClick={handleOnSubmit}>Submit</button>
    </React.Fragment>
  );

}

export default Table;