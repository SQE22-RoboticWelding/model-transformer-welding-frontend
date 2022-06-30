import {useEffect, useState} from "react";
import FetchHandler from "../common/FetchHandler";
import Settings from "../common/settings";
import { Button, Paper, styled, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import EditDialog from "./EditDialog";
import GenerateDialog from "./GenerateDialog";

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
    const [selectedProject, setSelectedProject] = useState(undefined);
    const [generate, setGenerate] = useState(false);
    const [edit, setEdit] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setProjectRetrievalState("loading");
        FetchHandler.readingJson(fetch(Settings.projectsPath, {method: "GET"}))
            .then((projects) => {
                setAvailableProjects(projects);
                setProjectRetrievalState("success");
            })
    }, []);

    const onEdit = (project) => {
      setSelectedProject(project);
      setEdit(true);
      setOpen(true);
    };

    const onGenerate = (project) => {
      setSelectedProject(project);
      setGenerate(true);
      setOpen(true);
    };

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
                              <StyledButton to="/generate/edit/{project.id}" onClick={() => onEdit(project)}>
                                    Edit
                              </StyledButton>
                            </StyledSingleTableCell>
                            <StyledSingleTableCell>
                              <StyledButton onClick={() => onGenerate(project)}>
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
            {(edit === true) ? (
              <EditDialog
                setEdit={setEdit}
                open={open}
                setOpen={setOpen}
                selectedProject={selectedProject}
                setSelectedProject={setSelectedProject}
              />
            ) : <div></div>}
            {(generate === true) ? (
              <GenerateDialog
                setGenerate={setGenerate}
                open={open}
                setOpen={setOpen}
                selectedProject={selectedProject}
                setSelectedProject={setSelectedProject}
              />
            ) : <div></div>}
        </GeneratorPageRoot>
    );
};

export default GeneratorPage;
