import FileDropZone from "./FileDropZone";
import {useState} from "react";
import Settings from "../common/settings";
import Notifications from "../common/Notifications";
import {Confirmation} from "../common/StyledComponents";
import FetchHandler from "../common/FetchHandler";
import {styled} from '@mui/system';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import UploadIcon from '@mui/icons-material/Upload';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import * as React from 'react';

  const UploadButton = styled(Button)({
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    borderRadius: 3,
    height: 48,
    padding: '0 30px',
  });
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

    const onSubmit = () => {
        setState("uploading");
        uploadProjectFile(projectName, projectFile)
            .then(() => {
                Notifications.notify("Project created.", "success")
                setState("idle");
            })
            .catch((err) => {
                Notifications.notify(`Failed to create project.\n${err}`, "error")
                setState("idle");
            })
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
                <ProjectName
                    placeholder="Project name"
                    value={projectName}
                    onChange={(e) => { setProjectName(e.target.value)}}>
                    <TextField id="outlined-basic" label="Outlined" variant="outlined" />
                </ProjectName>
                <UploadButton
                    onClick={onSubmit}
                    disabled={!projectName || !projectFile || state === "uploading"}
                    fontSize = "inherit"
                    endIcon={<UploadIcon />}
                >
                    Upload file
                </UploadButton>
                </Box>
            </Confirmation>
        </FileUploadRoot>
    );
};

export default FileUpload;
