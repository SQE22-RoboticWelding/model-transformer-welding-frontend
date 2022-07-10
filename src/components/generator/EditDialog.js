import React, { useEffect, useState } from "react";
import FetchHandler from "../common/FetchHandler";
import Settings from "../common/settings";
import Notifications from "../common/Notifications";
import Editor from "../editor/Editor";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, styled } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Link, useNavigate, useParams } from "react-router-dom";

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
  cursor: 'pointer',
  width: '128px',

  ':hover': {
    backgroundColor: '#BFBFBF',
  },
});

const StyledIconButton = styled(IconButton)({
    position: 'absolute',
    top: 10,
    right: 0,
  });

const synchronizeProject = (weldingPoints) => {
  return FetchHandler.simple(fetch(
      `${Settings.weldingPointsPath}`,
      {method: "PUT", body: JSON.stringify(weldingPoints), headers: {"Content-Type": "application/json"}}
  ));
};

const EditDialog = () => {
    let { id } = useParams();

    const [projectRetrievalState, setProjectRetrievalState] = useState("loading");
    const [selectedProject, setSelectedProject] = useState(undefined);
    const [weldingPoints, setWeldingPoints] = useState([]);
    const [robots, setRobots] = useState([]);
    const [open, setOpen] = useState(true);

    let navigate = useNavigate();

    useEffect(() => {
      FetchHandler.readingJson(fetch(Settings.projectPath + id, {method: "GET"}))
          .then((project) => {
              setSelectedProject(project);
              setProjectRetrievalState("success");
          })
          .catch((err) => {
              Notifications.notify(`Failed to retrieve projects\n${err}`, "error");
              setProjectRetrievalState("failed");
          });
  }, []);

    const onUpdate = () => synchronizeProject(weldingPoints)
        .then(() => Notifications.notify("Synchronized project", "success"))
        .catch((err) => Notifications.notify(`Failed to synchronize project\n${err}`));

    const closeEdit = () => {
      setOpen(false);
      navigate("/generate");
    };

    return (
      <EditDialogRoot>
        {(projectRetrievalState === "success" && selectedProject !== undefined) ? (
          <Dialog
            open={open}
            onClose={closeEdit}
            maxWidth={'lg'}
            fullWidth={true}
          >
            <DialogTitle>
              <h1>{selectedProject.name}</h1>
              <Link to="/generate">
                <StyledIconButton>
                  <CloseIcon />
                </StyledIconButton>
              </Link>
            </DialogTitle>
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
