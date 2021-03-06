import React, {useEffect, useState} from "react";
import FetchHandler from "../common/FetchHandler";
import Settings from "../common/settings";
import {
    IconButton,
    Grid,
    Paper,
    styled,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip
} from '@mui/material';
import {Link, Outlet, useLocation} from "react-router-dom";
import ProjectCreator from "./upload/ProjectCreator";
import SettingsIcon from '@mui/icons-material/Settings';

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

const ProjectPage = () => {
    const [projectRetrievalState, setProjectRetrievalState] = useState("idle");
    const [availableProjects, setAvailableProjects] = useState([]);

    const state = useLocation();

    const refreshProjects = () => {
        FetchHandler.readingJson(fetch(Settings.projectsPath, {method: "GET"}))
            .then((projects) => setAvailableProjects(projects))
            .finally(() => setProjectRetrievalState("idle"));
    };

    useEffect(() => {
        setProjectRetrievalState("loading");
        refreshProjects("loading")
    }, [state]);

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
                                        <Tooltip title="Edit/delete/generate project">
                                            <IconButton component={Link} to={`${project.id}`}>
                                                <SettingsIcon/>
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
            <Outlet/>
        </Grid>
    );
};

export default ProjectPage;
