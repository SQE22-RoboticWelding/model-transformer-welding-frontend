import React, {useEffect, useState} from "react";
import FetchHandler from "../common/FetchHandler";
import Settings from "../common/settings";
import {
    Button,
    IconButton,
    Paper,
    styled,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, Tooltip
} from '@mui/material';
import {Link, Outlet} from "react-router-dom";
import GenerateDialog from "./GenerateDialog";
import Notifications from "../common/Notifications";
import EditIcon from "@mui/icons-material/Edit";
import CodeIcon from "@mui/icons-material/Code";
import DeleteIcon from "@mui/icons-material/Delete";

const GeneratorPageRoot = styled('div')({
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',

    '> *': {
        marginBottom: '16px',
    }
});

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

const GeneratorPage = () => {
    const [projectRetrievalState, setProjectRetrievalState] = useState("idle");
    const [availableProjects, setAvailableProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(undefined);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setProjectRetrievalState("loading");
        FetchHandler.readingJson(fetch(Settings.projectsPath, {method: "GET"}))
            .then((projects) => setAvailableProjects(projects))
            .finally(() => setProjectRetrievalState("idle"));
    }, []);

    const onGenerate = (project) => {
        setSelectedProject(project);
        setOpen(true);
    };

    const onDelete = (id) => {
        FetchHandler.simple(fetch(`${Settings.projectsPath}/${id}`, {method: "DELETE"}))
            .then(() => setAvailableProjects(availableProjects.filter(project => project.id !== id)))
            .catch((err) => Notifications.notify(`Failed to delete project\n${err}`, "error"));
    };

    return (
        <GeneratorPageRoot>
            {(projectRetrievalState === "idle" && availableProjects.length > 0) ? (
                <TableContainer component={Paper}>
                    <StyledTable>
                        <StyledTableHead>
                            <StyledHeadTableRow>
                                <StyledSingleTableCell>Name</StyledSingleTableCell>
                                <StyledDoubleTableCell>Description</StyledDoubleTableCell>
                                <StyledSingleTableCell>Created</StyledSingleTableCell>
                                <StyledSingleTableCell>Last Modification</StyledSingleTableCell>
                                <StyledSingleTableCell>Actions</StyledSingleTableCell>
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
                                        <Tooltip title="Edit project">
                                        <StyledLink to={`${project.id}`}>
                                            <IconButton>
                                                <EditIcon color="info"/>
                                            </IconButton>
                                        </StyledLink>
                                        </Tooltip>

                                        <Tooltip title="Generate code for project">
                                        <IconButton onClick={() => onGenerate(project)}>
                                            <CodeIcon color="info" />
                                        </IconButton>
                                        </Tooltip>

                                        <Tooltip title="Delete project">
                                        <IconButton onClick={() => onDelete(project.id)}>
                                            <DeleteIcon color="error" />
                                        </IconButton>
                                        </Tooltip>
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
        </GeneratorPageRoot>
    );
};

export default GeneratorPage;
