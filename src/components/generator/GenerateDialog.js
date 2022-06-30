import {useEffect, useState} from "react";
import FetchHandler from "../common/FetchHandler";
import Settings from "../common/settings";
import Notifications from "../common/Notifications";
import { Button, Dialog, DialogContent, DialogTitle, IconButton, styled } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const StyledButton = styled(Button)({
  cursor: 'pointer',
  width: '128px',

  ':hover': {
    backgroundColor: '#BFBFBF',
  },
});

const synchronizeProject = (weldingPoints) => {
  return FetchHandler.simple(fetch(
      `${Settings.weldingPointsPath}`,
      {method: "PUT", body: JSON.stringify(weldingPoints), headers: {"Content-Type": "application/json"}}
  ));
};

const EditDialog = ({setGenerate ,open, setOpen, selectedProject, setSelectedProject}) => {
    const [projectRetrievalState, setProjectRetrievalState] = useState("idle");
    const [availableProjects, setAvailableProjects] = useState([]);
    const [weldingPoints, setWeldingPoints] = useState([]);
    const [robots, setRobots] = useState([]);

    useEffect(() => {
        setProjectRetrievalState("loading");
        FetchHandler.readingJson(fetch(Settings.projectsPath, {method: "GET"}))
            .then((projects) => {
                setAvailableProjects(projects);
                setProjectRetrievalState("success");
            })
    }, []);

    const onUpdate = () => synchronizeProject(weldingPoints)
        .then(() => Notifications.notify("Synchronized project", "success"))
        .catch((err) => Notifications.notify(`Failed to synchronize project\n${err}`));

    useEffect(() => {
      if(selectedProject) {
        if (!selectedProject && availableProjects.length > 0) {
            setSelectedProject(availableProjects[0]);
        }
      }
    }, [availableProjects]);

    const closeGenerate = () => {
      setSelectedProject(undefined);
      setOpen(false);
      setGenerate(false);
    };

    return (
        <Dialog
        open={open}
        onClose={closeGenerate}
        maxWidth={'lg'}
        fullWidth={true}
        >
          <DialogTitle>
            <h1>{selectedProject.name}</h1>
            <IconButton onClick={closeGenerate}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <StyledButton onClick={() => Notifications.notify("Not implemented yet", "warning")}>
              Download
            </StyledButton>
          </DialogContent>
        </Dialog>
    );
};

export default EditDialog;
