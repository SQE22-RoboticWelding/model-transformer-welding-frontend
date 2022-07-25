import React, {useEffect, useState} from "react";
import FetchHandler from "../common/FetchHandler";
import Settings from "../common/settings";
import {
    Button,
    Grid,
    Paper,
    styled,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import {Link, Outlet} from "react-router-dom";
import GenerateDialog from "./GenerateDialog";
import Notifications from "../common/Notifications";
import ProjectCreator from "./upload/ProjectCreator";

const StyledTable = styled(Table)({
    width: '100%',
    borderCollapse: 'collapse',
    boxShadow: '0 0 8px 0 #8E8E8E',
    borderRadius: '8px',
});
const StyledTableHead = styled(TableHead)({
    width: '100%',
});

const StyledHeadTableRow = styled(TableRow)({
    '> *': {
        padding: '2em',

        ':nth-of-type(odd)': {
            backgroundColor: '#EFEFEF',
        },

        ':nth-of-type(even)': {
            backgroundColor: '#DFDFDF',
        },
    },
});

const StyledBodyTableRow = styled(TableRow)({
    '> *': {
        borderTop: '1px solid black',
    }
});

const StyledTableCell = styled(TableCell)({
    borderBottom: '2px solid black',
});
const StyledSingleTableCell = styled(StyledTableCell)({
    width: 'calc(100% / 8)',
});
const StyledDoubleTableCell = styled(StyledTableCell)({
    width: 'calc(100% / 8 * 2)',
});

const StyledButton = styled(Button)({
    cursor: 'pointer',
    width: '128px',

    ':hover': {
        backgroundColor: '#BFBFBF',
    },
});

const StyledLink = styled(Link)({
    textDecoration: "none",
});

const ProjectPage = () => {
    const [projectRetrievalState, setProjectRetrievalState] = useState("idle");
    const [availableProjects, setAvailableProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(undefined);
    const [open, setOpen] = useState(false);

    const onGenerate = (project) => {
        setSelectedProject(project);
        setOpen(true);
    };

    const onDelete = (id) => {
        FetchHandler.simple(fetch(`${Settings.projectsPath}/${id}`, {method: "DELETE"}))
            .then(() => setAvailableProjects(availableProjects.filter(project => project.id !== id)))
            .catch((err) => Notifications.notify(`Failed to delete project\n${err}`, "error"));
    };

    const refreshProjects = () => {
        FetchHandler.readingJson(fetch(Settings.projectsPath, {method: "GET"}))
            .then((projects) => setAvailableProjects(projects))
            .finally(() => setProjectRetrievalState("idle"));
    };

    useEffect(() => {
        setProjectRetrievalState("loading");
        refreshProjects("loading")
    }, []);

    return (
        <Grid container direction="column" alignItems="center" rowGap="24px">
            <ProjectCreator onCreated={refreshProjects}/>

            {(projectRetrievalState === "idle" && availableProjects.length > 0) ? (
                <TableContainer component={Paper}>
                    <StyledTable>
                        <StyledTableHead>
                            <StyledHeadTableRow>
                                <StyledSingleTableCell>Name</StyledSingleTableCell>
                                <StyledDoubleTableCell>Description</StyledDoubleTableCell>
                                <StyledSingleTableCell>Created</StyledSingleTableCell>
                                <StyledSingleTableCell>Last Modification</StyledSingleTableCell>
                                <StyledSingleTableCell>Edit</StyledSingleTableCell>
                                <StyledSingleTableCell>Generate</StyledSingleTableCell>
                                <StyledSingleTableCell>Delete</StyledSingleTableCell>
                            </StyledHeadTableRow>
                        </StyledTableHead>

                        <TableBody>
                            {availableProjects.map((project) => (
                                <StyledBodyTableRow key={project.id}>
                                    <StyledSingleTableCell>{project.name}</StyledSingleTableCell>
                                    <StyledDoubleTableCell>{project.description}</StyledDoubleTableCell>
                                    <StyledSingleTableCell>{new Date(project.created_at).toLocaleString("de-DE")}</StyledSingleTableCell>
                                    <StyledSingleTableCell>{new Date(project.modified_at).toLocaleString("de-DE")}</StyledSingleTableCell>
                                    <StyledSingleTableCell>
                                        <StyledLink to={`${project.id}`}>
                                            <StyledButton>
                                                Edit
                                            </StyledButton>
                                        </StyledLink>
                                    </StyledSingleTableCell>
                                    <StyledSingleTableCell>
                                        <StyledButton onClick={() => onGenerate(project)}>
                                            Generate
                                        </StyledButton>
                                    </StyledSingleTableCell>
                                    <StyledSingleTableCell>
                                        <StyledButton onClick={() => onDelete(project.id)}>
                                            Delete
                                        </StyledButton>
                                    </StyledSingleTableCell>
                                </StyledBodyTableRow>
                            ))}
                        </TableBody>
                    </StyledTable>
                </TableContainer>
            ) : projectRetrievalState === "idle" ? (
                <p>No Projects to show</p>
            ) : projectRetrievalState === "loading" &&
                <p>Loading...</p>
            }

            {selectedProject && (
                <GenerateDialog
                    open={open}
                    setOpen={setOpen}
                    selectedProject={selectedProject}
                    setSelectedProject={setSelectedProject}
                />
            )}

            <Outlet/>
        </Grid>
    );
};

export default ProjectPage;