import FileDropZone from "./FileDropZone";
import Settings from "../../common/settings";
import FetchHandler from "../../common/FetchHandler";
import {styled} from '@mui/system';
import UploadIcon from '@mui/icons-material/Upload';
import * as React from "react";
import {useState} from "react";
import {Button, Container, List, ListItem, TextField} from '@mui/material';
import Notifications from "../../common/Notifications";
import {useNavigate} from "react-router-dom";

const ProjectDescription = styled(TextField)({
    marginTop: '20px',
    required: true,
    width: '450px'
});

const uploadProjectFile = (projectName, projectFile) => {
    const query = new URLSearchParams({name: projectName});
    const body = new FormData();
    body.append("file", projectFile);
    return FetchHandler.readingJson(
        fetch(`${Settings.uploadPath}?${query}`, {method: "POST", body})
    );
};

const FileUpload = ({onCreated}) => {
    const [projectFile, setProjectFile] = useState();
    const [projectName, setProjectName] = useState("");
    const navigate = useNavigate();

    const onSubmit = () => {
        if (projectName && projectFile) {
            uploadProjectFile(projectName, projectFile)
                .then((project) => {
                    onCreated();
                    Notifications.notify("Successfully uploaded project.", "success");
                    navigate(`/project/${project.id}`, {replace: true});
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
        <Container>
            <List>
                <ListItem>
                    <FileDropZone
                        file={projectFile}
                        onFile={setProjectFile}
                    />
                </ListItem>

                <ListItem>
                    <TextField
                        label="Project name"
                        required
                        variant="standard"
                        fullWidth
                        placeholder="Project name"
                        value={projectName}
                        onChange={handleInputChange}/>
                </ListItem>

                <ListItem>
                    <ProjectDescription
                        label="Project Description"
                        multiline
                        rows={4}/>
                </ListItem>

                <ListItem>
                    <Button variant="contained" onClick={onSubmit} endIcon={<UploadIcon/>}>
                        Create Project
                    </Button>
                </ListItem>
            </List>
        </Container>
    );
};

export default FileUpload;
