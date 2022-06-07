import React, { useState, useRef } from 'react';
import Dropzone , {useDropzone} from 'react-dropzone';
import { read, write } from 'xlsx';

import Table from './table/Table';

function Drag() {

  const [file, setFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState('');
  const [files$, setFiles] = useState([]);
  const dropRef = useRef(); // React ref for managing the hover state of droppable area

  const onDrop = (files) => {
    const [uploadedFile] = files;
    setFile(uploadedFile);

    const fileReader = new FileReader();
    fileReader.onload = () => {

      var data = new Uint8Array(fileReader.result);
      var wb = read(data, { type:'array' });
      var htmlStr = write(wb, { type:'binary', bookType:'html' })
      setPreviewSrc(htmlStr);
      
    };
    fileReader.readAsArrayBuffer(uploadedFile);
    dropRef.current.style.border = '2px dashed #e9ebeb';
  };

  const updateBorder = (dragState) => {
    if (dragState === 'over') {
      dropRef.current.style.border = '2px solid #000';
    } else if (dragState === 'leave') {
      dropRef.current.style.border = '2px dashed #e9ebeb';
    }
  };

  const handleOnSubmit = async (event) => {
    event.preventDefault();
  };
  const {
    acceptedFiles,
    fileRejections,
    getRootProps,
    getInputProps
  } = useDropzone({
      accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'] ,
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : []
    }, 
    maxFiles:1,
    
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })));
      console.log(acceptedFiles,fileRejections);
    }
  });

  return (
    <React.Fragment>
      <div className="upload-section" onSubmit={handleOnSubmit}> 
        <div >
         
          
              <div {...getRootProps({ className: 'drop-zone' })} ref={dropRef}>
                <input {...getInputProps()} />
                <p>Drag and drop a file OR click here to select a file.</p>
                {file && (
                  <div>
                    <strong>Selected file:</strong> {file.name}
                  </div>
                )}
              </div>
          
         
        </div>
      </div>
      {previewSrc && (
        <Table data = {previewSrc} />
      )}
    </React.Fragment>
  );
};

export default Drag;