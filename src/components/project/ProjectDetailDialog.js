import React, {useEffect, useState} from "react";
import FetchHandler from "../common/FetchHandler";
import Settings from "../common/settings";
import Notifications from "../common/Notifications";
import Editor from "./editor/Editor";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, Grid,
    IconButton,
    styled,
    Tooltip
} from '@mui/material';
import {Link, useNavigate, useParams} from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import CodeIcon from "@mui/icons-material/Code";
import DeleteIcon from "@mui/icons-material/Delete";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

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

const ControlButton = styled(IconButton)({
    width: "60px",
    display: "flex",
    flexDirection: "column",
    fontSize: "12px",
    fontWeight: "400"
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

const ProjectDetailDialog = () => {
    const [projectRetrievalState, setProjectRetrievalState] = useState("idle");
    const [selectedProject, setSelectedProject] = useState(undefined);
    const [weldingPoints, setWeldingPoints] = useState([]);
    const [robots, setRobots] = useState([]);
    const [generateOpened, setGenerateOpened] = useState(false);
    
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
            setValidWeldingPoints(weldingPoints);
            synchronizeProject(weldingPoints)
                .then(() => Notifications.notify("Synchronized project", "success"))
                .catch((err) => Notifications.notify(`Failed to synchronize project\n${err}`, "error"));
        } else {
            setValidWeldingPoints(localValidWeldingPoints);
        }

    };

    const openGenerate = () => {
        FetchHandler.simple(fetch(Settings.validateGeneratePath(selectedProject.id), {method: "GET"}))
            .then(() => setGenerateOpened(true))
            .catch((err) => Notifications.notify(`Generation validation failed\n${err}`, "error"));
    };

    const closeDialog = () => {
        navigate("/view");
    };

    const onDelete = () => {
        FetchHandler.simple(fetch(`${Settings.projectsPath}/${id}`, {method: "DELETE"}))
            .then(() => navigate("/view", {state: "refreshProjects"}))
            .catch((err) => Notifications.notify(`Failed to delete project\n${err}`, "error"));
    };

    return (
        <EditDialogRoot>
            {(projectRetrievalState === "success" && selectedProject !== undefined) ? (
                <Dialog
                    open={Boolean(id) || id === 0}
                    onClose={closeDialog}
                    fullScreen
                >
                    <StyledDialogTitle>
                        <Grid item display="flex" gap="50px" >
                        <ControlButton component={Link} to="/view">
                            <ArrowBackIcon/>
                            <div style={{lineHeight: "2"}}>
                                Back
                            </div>
                        </ControlButton>
                        <b>{selectedProject.name}</b>
                        </Grid>
                        <Grid item display="flex" gap="30px">
                            <ControlButton onClick={openGenerate}>
                                <CodeIcon color="info"/>
                                Generate Code
                            </ControlButton>

                            <ControlButton onClick={onDelete}>
                                <DeleteIcon color="error"/>
                                Delete Project
                            </ControlButton>
                        </Grid>
                    </StyledDialogTitle>
                    <DialogContent dividers>
                        {generateOpened ? (
                            <Button variant="contained" size="medium" endIcon={<FileDownloadIcon/>}
                                    href={Settings.generatePath(selectedProject.id)}>
                                Download
                            </Button>
                        ) : (
                            <Editor
                                project={selectedProject}
                                weldingPoints={weldingPoints}
                                validWeldingPoints={validWeldingPoints}
                                setWeldingPoints={setValidatedWeldingPoints}
                                robots={robots}
                            />
                        )}
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

export default ProjectDetailDialog;
