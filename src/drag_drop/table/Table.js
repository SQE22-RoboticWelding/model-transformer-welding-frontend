import { read, write } from 'xlsx';

function Table(props) {

  const doc = new DOMParser().parseFromString(props.data, 'text/html');

  return (
    <div className="Table" dangerouslySetInnerHTML={{__html: props.data}}>
    </div>
  );

}

export default Table;
