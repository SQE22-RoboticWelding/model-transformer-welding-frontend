import React, { useState, useRef } from 'react';
import Dropzone from 'react-dropzone';
import { read, utils } from 'xlsx';

import GenerateTable from './table/Table';

function Drag() {

  const [file, setFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState(null);
  const dropRef = useRef(); // React ref for managing the hover state of droppable area

  const onDrop = (files) => {
    const [uploadedFile] = files;
    setFile(uploadedFile);

    const fileReader = new FileReader();
    fileReader.onload = () => {                       // expecting only one sheet. therefore, only ready sheet at index 0.
      const data = new Uint8Array(fileReader.result);
      const wb = read(data, { type:'array' });
      const wsName = wb.SheetNames[0];
      const jsonSheet = utils.sheet_to_json(wb.Sheets[wsName]);
      setPreviewSrc(jsonSheet);
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

  const handleOnSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <React.Fragment>
      <div className="upload-section" onSubmit={handleOnSubmit}>
        <Dropzone accept='.xlsx,.xls,.csv' multiple={false}
                  onDrop={onDrop}
                  onDragEnter={() => updateBorder('over')}
                  onDragLeave={() => updateBorder('leave')}
        >
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps({ className: 'drop-zone' })} ref={dropRef}>
              <input {...getInputProps()} />
              <p>Drag and drop a file OR click here to select a file.</p>
              {file && (
                <div>
                  <b>Selected file:</b> {file.name}
                </div>
              )}
            </div>
          )}
        </Dropzone>
      </div>
      {previewSrc && (
        <GenerateTable data={previewSrc} />
      )}
    </React.Fragment>
  );
};

export default Drag;
