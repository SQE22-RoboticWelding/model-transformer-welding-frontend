import React, { useState, useRef } from 'react';
import {Form} from 'react-bootstrap';
import Dropzone,{useDropzone} from 'react-dropzone';


const Drag = ()  => {

  const [file, setFile] = useState(null); 
  const [previewSrc,setPreviewSrc] = useState(''); 
  const dropRef = useRef(); // React ref for managing the hover state of droppable area  
  const [files$, setFiles] = useState([]);

  const onDrop = (files) => {
    const [uploadedFile] = files;
    setFile(uploadedFile);  
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewSrc(fileReader.result);
    };
    fileReader.readAsDataURL(uploadedFile);
    
    console.log( acceptedFiles,fileRejections,files$);
    
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
      <Form  onSubmit={handleOnSubmit}>
       
    
        <div className="upload-section"> 
           <div>
               
                  <div {...getRootProps({ className: 'drop-zone' })} ref={dropRef}>
                       <input {...getInputProps()} />
                       <p>please select the file...</p>
                                 {file && (
                                         <div>
                                            <strong>Selected file:</strong> {file.name}
                                          </div>
                                          )}
                    </div>
            </div>
       </div>
      </Form>
    </React.Fragment>
  );
};
export default Drag;