import React, { useState, useRef } from 'react';
import {useDropzone} from 'react-dropzone';
import { read, write, utils } from 'xlsx';
import GenerateTable from './table/GenerateTable';
import {Menu,MenuItem} from "react-pro-sidebar";
import { FaBars , FaArrowRight} from "react-icons/fa";



function Drag() {


  const [file, setFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState('');
  const [setFiles] = useState([]);
  const dropRef = useRef(); // React ref for managing the hover state of droppable area
  const [on, setOn] = React.useState(false);
 


  const onDrop = (files) => {
    const [uploadedFile] = files;
    setFile(uploadedFile);
    
    const fileReader = new FileReader();
    fileReader.onload = () => {

      var data = new Uint8Array(fileReader.result);
      var wb = read(data, { type:'array' });
      var wsName = wb.SheetNames[0];
      console.log("wsName: " + wsName)
      var jsonSheet = utils.sheet_to_json(wb.Sheets[wsName]);
      console.log(jsonSheet)
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
      'text/csv': ['.csv','.xls','xlsx'],
      'application/vnd.ms-excel': ['.xls','xlsx'] ,
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
  const SideBar = ({ openClass }) => {
    return (
      <nav className={openClass === 'open' ? 'opneSidebar' : ''}>
      
      
            <a className="menu-item" href="/newproject">
               <FaArrowRight/> start a new project
            </a>
       
  
          
            <a className="menu-item" href="/list">
            <FaArrowRight/> list of the projects
            </a>
         
        
      </nav>
    );
  };
  const handleOn = () => {
    setOn(!on);
  };
  
  return (
    <React.Fragment>
      <div className="upload-section" onSubmit={handleOnSubmit}> 
        <div onDrop={onDrop}
                    onDragEnter={() => updateBorder('over')}
                    onDragLeave={() => updateBorder('leave')}>
        
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
      {previewSrc && 
        <GenerateTable data = {previewSrc} />
      }
          <div className="sidebar">
            <a className="active" href="#Overview">Overview</a>      
                 <aside className={on ? 'to-right' : ''}> 
                  <a href="#" onClick={handleOn}>  <FaBars/>   projects
                            <Menu size="35" />
                                     </a>
                               </aside>
                           {on && <SideBar openClass="open" />}
          </div>        
    </React.Fragment>
  );
};

export default Drag;