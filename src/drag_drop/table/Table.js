
function Table(props) {

  return (
    <div className="Table" dangerouslySetInnerHTML={{__html: props.data}}>
    </div>
  );

}

export default Table;
