import styled from "styled-components";
import FileDropZone from "./FileDropZone";
import {useState} from "react";
import Settings from "../common/settings";
import Notifications from "../common/Notifications";
import {Confirmation} from "../common/StyledComponents";
import FetchHandler from "../common/FetchHandler";


const FileUploadRoot = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Input = styled.input`
  height: 2em;
  border-radius: 4px;
  border: none;
  margin-right: 20px;
`;

const UploadButton = styled.button`
  height: 2em;
  width: 10em;
`;

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
                <Input
                    placeholder="Project name"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                />

                <UploadButton
                    onClick={onSubmit}
                    disabled={!projectName || !projectFile || state === "uploading"}
                >
                    Upload file
                </UploadButton>
            </Confirmation>
        </FileUploadRoot>
    );
};

export default FileUpload;
