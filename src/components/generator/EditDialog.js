import React, {useEffect, useState} from "react";
import FetchHandler from "../common/FetchHandler";
import Settings from "../common/settings";
import Notifications from "../common/Notifications";
import Editor from "../editor/Editor";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, styled, Tooltip} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {Link, useNavigate, useParams} from "react-router-dom";
import SaveIcon from '@mui/icons-material/Save';

const EditDialogRoot = styled('div')({
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',

    '> *': {
        marginBottom: '16px',
    }
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

const isToleranceValid = (weldingPoint) => {
    if (weldingPoint.tolerance == null) {
        return true;
    }

    const xDistSquare = Math.pow((weldingPoint.x - weldingPoint.x_original), 2);
    const yDistSquare = Math.pow((weldingPoint.y - weldingPoint.y_original), 2);
    const zDistSquare = Math.pow((weldingPoint.z - weldingPoint.z_original), 2);
    const distanceFromOrigin = Math.pow((xDistSquare + yDistSquare + zDistSquare), 0.5);

    return distanceFromOrigin <= weldingPoint.tolerance;
};

const EditDialog = () => {
    const [projectRetrievalState, setProjectRetrievalState] = useState("idle");
    const [selectedProject, setSelectedProject] = useState(undefined);
    const [weldingPoints, setWeldingPoints] = useState([]);
    const [robots, setRobots] = useState([]);
    const [open, setOpen] = useState(true);
    
    const [validWeldingPoints, setValidWeldingPoints] = useState([]);

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

    const setValidatedWeldingPoints = (candidateWeldingPoints) => {
        setValidWeldingPoints(candidateWeldingPoints.filter(isToleranceValid));
        setWeldingPoints(candidateWeldingPoints);
    };

    const onValidatedSave = () => {
        const localValidWeldingPoints = weldingPoints.filter(isToleranceValid);
        
        if (localValidWeldingPoints.length === weldingPoints.length) {
            setValidWeldingPoints([]);
            synchronizeProject(weldingPoints)
                .then(() => Notifications.notify("Synchronized project", "success"))
                .catch((err) => Notifications.notify(`Failed to synchronize project\n${err}`, "error"));
        } else {
            setValidWeldingPoints(localValidWeldingPoints);
        }

    }

    const closeEdit = () => {
        setOpen(false);
        navigate("/view");
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
                        <Link to="/view">
                            <IconButton>
                                <CloseIcon/>
                            </IconButton>
                        </Link>
                    </StyledDialogTitle>
                    <DialogContent dividers>
                        <Editor
                            project={selectedProject}
                            weldingPoints={weldingPoints}
                            validWeldingPoints={validWeldingPoints}
                            setWeldingPoints={setValidatedWeldingPoints}
                            robots={robots}
                        />
                    </DialogContent>
                    <DialogActions>
                        {validWeldingPoints.length === weldingPoints.length ? (
                            <Button onClick={onValidatedSave} variant="contained" size="medium" endIcon={<SaveIcon/>}>
                                Save
                            </Button>
                        ) : (
                            <Tooltip title="There are invalid welding points">
                                <Button variant="contained" size="medium" endIcon={<SaveIcon/>} color="error">
                                    Save
                                </Button>
                            </Tooltip>
                        )}
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
