import FileDropZone from "./FileDropZone";
import Settings from "../common/settings";
import {Confirmation} from "../common/StyledComponents";
import FetchHandler from "../common/FetchHandler";
import {styled} from '@mui/system';
import Input from '@mui/material/Input';
import UploadIcon from '@mui/icons-material/Upload';
import {useState} from "react";
import EditorPage from "../editor/EditorPage";
import Box from '@mui/material/Box';
import * as React from 'react';
import {Button,TextField,Dialog} from '@mui/material';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Notifications from "../common/Notifications";
import { Routes,Route } from "react-router-dom";

/*
  const UploadButton = styled(Button)({
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    borderRadius: 3,
    height: 48,
    padding: '0 30px',
  }); */
  const FileUploadRoot = styled('div')({
    alignItems: "center",
    boxShadow: '0 3px 5px 2px ',
    background: '#FFFFFF',
    padding: '0 20px',
    
  });
  
  const ProjectName = styled(Input)({
    height: 50,
    margin:'none',
    width: 'auto',
    required : true,
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
    const handleClose = () => {
        setOpen(false);
      };

      const onSubmit = (e) => {
        setOpen(true);
        e.preventDefault();
        uploadProjectFile(projectName, projectFile)
        .then(() => {
            Notifications.notify("Project created.", "success")
            setState("idle");
            setOpen(true);
            return (
                <Dialog
                open={open}
                onClose={handleClose}>
                 <DialogTitle> Edit projects </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                             <Routes>
                                <Route path="/edit" element={<EditorPage/>}/>
                            </Routes>
                        </DialogContentText>
                    </DialogContent>
           </Dialog>
            );
        })
        .catch((err) => {
            Notifications.notify(`Failed to create project.\n`, "error")
            setState("idle");
            alert('please enter the project name or upload the data file');
        })
      };

      const handleInpuChange = (e) => {
        setProjectName(e.target.value);
          enableButton(e.target.value);
    };
    /*const onSubmit = () => {
        setState("uploading");
        uploadProjectFile(projectName, projectFile)
            .then(() => {
                Notifications.notify("Project created.", "success")
                setState("idle");
                setOpen(true);
                return (
                    <Dialog
                    open={open}
                    onClose={handleClose}>
                     <DialogTitle> Edit projects </DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                 <EditorPage></EditorPage>
                            </DialogContentText>
                        </DialogContent>
               </Dialog>
                );
            })
            .catch((err) => {
                Notifications.notify(`Failed to create project.\n${err}`, "error")
                setState("idle");
            })
    };*/

    return (
        <FileUploadRoot>
            <FileDropZone
                file={projectFile}
                onFile={setProjectFile}
            />
                
            <Confirmation>
               <Box  component="form"  sx={{ '& > :not(style)': { m: 1, width: '25ch' },  }}
                     noValidate autoComplete="off" >
                <ProjectName
                    placeholder="Project name"
                    value={projectName}
                    onChange={handleInpuChange}>
                    <TextField id="outlined-basic" label="Outlined" variant="outlined" />
                </ProjectName>
                <Button variant="contained" 
                        onClick={onSubmit}  endIcon={<UploadIcon  disabled={!projectName} />}>Upload file
                        
                </Button>
                </Box>
            </Confirmation>
        </FileUploadRoot>
    );
};

export default FileUpload;
