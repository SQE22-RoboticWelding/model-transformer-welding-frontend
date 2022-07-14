import FileDropZone from "./FileDropZone";
import Settings from "../common/settings";
import {Confirmation} from "../common/StyledComponents";
import FetchHandler from "../common/FetchHandler";
import {styled} from '@mui/system';
import UploadIcon from '@mui/icons-material/Upload';
import {useState} from "react";
import EditorPage from "../editor/EditorPage";
import Box from '@mui/material/Box';
import * as React from 'react';
import {Button,TextField,Dialog} from '@mui/material';
import Notifications from "../common/Notifications";
import { useNavigate } from "react-router-dom";


  const FileUploadRoot = styled('div')({
    alignItems: "center",
    boxShadow: '0 3px 5px 2px ',
    background: '#FFFFFF',
    padding: '0 20px',
    
  });
  
  const ProjectName = styled(TextField)({
    height: 45,
    margin:'none',
    width: 30,
    required : true,
  }); 
  const Projectdecription= styled(TextField)({
    marginTop:20 ,
    required : true,
    width : 450
  }); 
const uploadProjectFile = (projectName, projectFile) => {
    const query = new URLSearchParams({name: projectName});
    const body = new FormData();
    body.append("file", projectFile);
    return FetchHandler.simple(
        fetch(`${Settings.uploadPath}?${query}`, {method: "POST", body})
    );
};

const FileUpload = () => {
    const [state, setState] = useState("idle");
    const [projectFile, setProjectFile] = useState();
    const [projectName, setProjectName] = useState("");
    const [open,setOpen] = React.useState(false);
    const [enableButton] = useState("");
    const navigate = useNavigate();
    const handleClose = () => {
        setOpen(false);
      };
    

    const onSubmit = (e) => {
        setOpen(true);
        e.preventDefault();
        uploadProjectFile(projectName, projectFile)
         if (projectName && projectFile) {
            Notifications.notify("Project created.", "success")
            setState("idle");
            setOpen(true);
            navigate("/edit", { replace: true });
        } else {
            Notifications.notify(`Failed to create project.\n`, "error")
            setState("idle"); 
            alert('please enter the project name or upload the data file');
        }
      };

      const handleInpuChange = (e) => {
        setProjectName(e.target.value);
        enableButton(e.target.value);
    };
    
    return (
        <FileUploadRoot>
            <FileDropZone
                file={projectFile}
                onFile={setProjectFile}
            />
                
            <Confirmation>
               <Box  component="form"  sx={{ '& > :not(style)': { m: 1, width: '25ch' },  }}
                     noValidate autoComplete="off" >
                <ProjectName id="outlined-basic" label="Project name" variant="outlined"
                    value={projectName}
                    onChange={handleInpuChange}>
                     
                </ProjectName>
                <Button variant="contained" 
                        onClick={onSubmit}  endIcon={<UploadIcon />} >Upload file        
                </Button>
                <div>
                <Projectdecription
                       id="outlined-multiline-static"
                       label="project decription"
                       multiline
                       rows={4}/>
                </div>
                </Box>
            </Confirmation>
        </FileUploadRoot>
    );
};

export default FileUpload;
