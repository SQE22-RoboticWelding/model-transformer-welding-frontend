import FileDropZone from "./FileDropZone";
import Settings from "../common/settings";
import {Confirmation} from "../common/StyledComponents";
import FetchHandler from "../common/FetchHandler";
import {styled} from '@mui/system';
import UploadIcon from '@mui/icons-material/Upload';
import {useState} from "react";
import Box from '@mui/material/Box';
import * as React from 'react';
import {Button, TextField} from '@mui/material';
import Notifications from "../common/Notifications";
import {useNavigate} from "react-router-dom";

const FileUploadRoot = styled('div')({
    boxShadow: '0 3px 5px 2px',
    padding: '0 20px',
});
const ProjectDescription = styled(TextField)({
    marginTop: '20px',
    required: true,
    width: '450px'
});

const UploadBox = styled(Box)({
    '& > :not(style)': {m: 1, width: '25ch'}
});

const uploadProjectFile = (projectName, projectFile) => {
    const query = new URLSearchParams({name: projectName});
    const body = new FormData();
    body.append("file", projectFile);
    return FetchHandler.readingJson(
        fetch(`${Settings.uploadPath}?${query}`, {method: "POST", body})
    );
};

const FileUpload = () => {
    const [projectFile, setProjectFile] = useState();
    const [projectName, setProjectName] = useState("");
    const navigate = useNavigate();

    const onSubmit = () => {
        if (projectName && projectFile) {
            uploadProjectFile(projectName, projectFile)
                .then((project) => {
                    Notifications.notify("Successfully uploaded project.", "success");
                    navigate(`/generate/${project.id}`, {replace: true});
                });
        } else if (!projectName && projectFile) {
            Notifications.notify(`Please enter the project name`, "error");
        } else if (projectName && !projectFile) {
            Notifications.notify(`Please upload the project file`, "error");
        } else {
            Notifications.notify(`Please upload the project file and enter the project name`, "error");
        }
    };
    const handleInputChange = (e) => {
        setProjectName(e.target.value);
    };
    return (
        <FileUploadRoot>
            <FileDropZone
                file={projectFile}
                onFile={setProjectFile}
            />

            <Confirmation>
                <UploadBox>
                    <TextField label="Project name" variant="standard" placeholder="Project name"
                               value={projectName}
                               onChange={handleInputChange}>

                    </TextField>
                    <Button variant="contained" onClick={onSubmit} endIcon={<UploadIcon/>}>
                        Upload file
                    </Button>
                    <div>
                        <ProjectDescription
                            label="Project Description"
                            multiline
                            rows={4}/>
                    </div>
                </UploadBox>
            </Confirmation>
        </FileUploadRoot>
    );
};

export default FileUpload;
