import React, {useEffect, useState} from "react";
import FetchHandler from "../common/FetchHandler";
import Settings from "../common/settings";
import Notifications from "../common/Notifications";
import Editor from "./editor/Editor";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, styled} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {Link, useNavigate, useParams} from "react-router-dom";

const EditDialogRoot = styled('div')({
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',

    '> *': {
        marginBottom: '16px',
    }
});

const StyledButton = styled(Button)({
    width: '128px',

    ':hover': {
        backgroundColor: '#BFBFBF',
    },
});

const StyledDialogTitle = styled(DialogTitle)({
    display: "flex",
    justifyContent: "space-between"
});

const synchronizeProject = (weldingPoints) => {
    return FetchHandler.simple(fetch(
        `${Settings.weldingPointsPath}`,
        {method: "PUT", body: JSON.stringify(weldingPoints), headers: {"Content-Type": "application/json"}}
    ));
};

const EditDialog = () => {
    const [projectRetrievalState, setProjectRetrievalState] = useState("idle");
    const [selectedProject, setSelectedProject] = useState(undefined);
    const [weldingPoints, setWeldingPoints] = useState([]);
    const [robots, setRobots] = useState([]);
    const [open, setOpen] = useState(true);

    let navigate = useNavigate();
    let {id} = useParams();

    useEffect(() => {
        setProjectRetrievalState("loading");
        FetchHandler.readingJson(fetch(`${Settings.projectsPath}/${id}`, {method: "GET"}))
            .then((project) => {
                setSelectedProject(project);
                setProjectRetrievalState("success");
            })
            .catch((err) => {
                Notifications.notify(`Failed to retrieve projects\n${err}`, "error");
                setProjectRetrievalState("failed");
            });
    }, [id]);

    useEffect(() => {
        FetchHandler.readingJson(fetch(Settings.robotPath, {method: "GET"}))
            .then((robots) => {
                setRobots(robots);
                setProjectRetrievalState("success");
            })
            .catch((err) => {
                Notifications.notify(`Failed to retrieve robots\n${err}`, "error");
                setProjectRetrievalState("failed");
            });
    }, []);

    const onUpdate = () => synchronizeProject(weldingPoints)
        .then(() => Notifications.notify("Synchronized project", "success"))
        .catch((err) => Notifications.notify(`Failed to synchronize project\n${err}`));

    const closeEdit = () => {
        setOpen(false);
        navigate("/project");
    };

    return (
        <EditDialogRoot>
            {(projectRetrievalState === "success" && selectedProject !== undefined) ? (
                <Dialog
                    open={open}
                    onClose={closeEdit}
                    maxWidth="lg"
                    fullWidth={true}
                >
                    <StyledDialogTitle>
                        <b>{selectedProject.name}</b>
                        <Link to="/project">
                            <IconButton>
                                <CloseIcon/>
                            </IconButton>
                        </Link>
                    </StyledDialogTitle>
                    <DialogContent dividers>
                        <Editor
                            project={selectedProject}
                            weldingPoints={weldingPoints}
                            setWeldingPoints={setWeldingPoints}
                            robots={robots}
                        />
                    </DialogContent>
                    <DialogActions>
                        <StyledButton onClick={onUpdate}>
                            Update project!
                        </StyledButton>
                    </DialogActions>
                </Dialog>
            ) : projectRetrievalState === "success" ? (
                <p>There are no projects yet</p>
            ) : projectRetrievalState === "failed" ? (
                <p>
                    Failed to retrieve projects.
                </p>
            ) : projectRetrievalState === "loading" &&
                <p>Loading...</p>
            }
        </EditDialogRoot>
    );
};

export default EditDialog;
