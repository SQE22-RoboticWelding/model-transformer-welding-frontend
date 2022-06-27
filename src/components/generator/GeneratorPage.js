import {useEffect, useState} from "react";
import FetchHandler from "../common/FetchHandler";
import Settings from "../common/settings";
import Notifications from "../common/Notifications";
import { Button, Paper, styled, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'

const GeneratorPageRoot = styled('div')({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',

  marginBottom: '16px',
  /*> * {
    margin-bottom: 16px;
  }*/
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
  padding: '2em',
  ':nth-child(odd)': {
    backgroundColor: '#EFEFEF',
  },
  ':nth-child(even)': {
    backgroundColor: '#DFDFDF',
  },
});

const StyledBodyTableRow = styled(TableRow)({
  borderTop: '1px solid black',
  /*> * {
    border-top: 1px solid black;
  }*/
});

const StyledTableCell = styled(TableCell)({
  borderBottom: '2px solid black',
});
const StyledSingleTableCell = styled(StyledTableCell)({
  width: 'calc(100% / 7)',
});
const StyledDoubleTableCell = styled(StyledTableCell)({
  width: 'calc(100% / 7 * 2)',
});

const StyledButton = styled(Button)({
  cursor: 'pointer',
  width: '128px',
  ':hover': {
    backgroundColor: '#BFBFBF',
  },
});

const GeneratorPage = () => {
    const [projectRetrievalState, setProjectRetrievalState] = useState("idle");
    const [availableProjects, setAvailableProjects] = useState([]);

    useEffect(() => {
        setProjectRetrievalState("loading");
        FetchHandler.readingJson(fetch(Settings.projectsPath, {method: "GET"}))
            .then((projects) => {
                setAvailableProjects(projects);
                setProjectRetrievalState("success");
            })
    }, []);

    return (
        <GeneratorPageRoot>
            {(projectRetrievalState === "success" && availableProjects.length > 0) ? (
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
                              <StyledButton onClick={() => Notifications.notify("Not implemented yet", "warning")}>
                                  Edit
                              </StyledButton>
                            </StyledSingleTableCell>
                            <StyledSingleTableCell>
                              <StyledButton onClick={() => Notifications.notify("Not implemented yet", "warning")}>
                                  Generate
                              </StyledButton>
                            </StyledSingleTableCell>
                        </StyledBodyTableRow>
                    ))}
                    </TableBody>
                </StyledTable>
              </TableContainer>
            ) : projectRetrievalState === "success" ? (
                <p>There are no projects yet</p>
            ) : projectRetrievalState === "loading" &&
                <p>Loading...</p>
            }
        </GeneratorPageRoot>
    );
};

export default GeneratorPage;
