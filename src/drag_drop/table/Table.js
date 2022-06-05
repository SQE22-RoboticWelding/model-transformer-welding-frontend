import { read, write } from 'xlsx';

function Table(props) {

  const inner = {}

  return (
    <div className="Table">
      {props.data}
    </div>
  );

}

export default Table;
