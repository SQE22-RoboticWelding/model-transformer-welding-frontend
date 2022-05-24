import React, { useState, useRef } from 'react';
import {Form} from 'react-bootstrap';
import Dropzone from 'react-dropzone';

const Drag = ()  => {

  const [file, setFile] = useState(null); 
  const [setPreviewSrc] = useState(''); 
  const dropRef = useRef(); // React ref for managing the hover state of droppable area  

  const onDrop = (files) => {
    const [uploadedFile] = files;
    setFile(uploadedFile);  
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewSrc(fileReader.result);
    };
    fileReader.readAsDataURL(uploadedFile);
    
  };

  const handleOnSubmit = async (event) => {
    event.preventDefault();
  };  
  return (
    <React.Fragment>
      <Form  onSubmit={handleOnSubmit}>
       
    
        <div className="upload-section"> 
           <div>
             <Dropzone onDrop={onDrop}>
                 {({ getRootProps, getInputProps }) => (
                  <div {...getRootProps({ className: 'drop-zone' })} ref={dropRef}>
                       <input {...getInputProps()} />
                       <p>please select the file...</p>
                                 {file && (
                                         <div>
                                            <strong>Selected file:</strong> {file.name}
                                          </div>
                                          )}
                    </div>
                  )}
             </Dropzone>
            </div>
       </div>
      </Form>
    </React.Fragment>
  );
};
export default Drag;
