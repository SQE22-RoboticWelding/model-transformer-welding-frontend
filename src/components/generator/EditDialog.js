import {useState} from "react";
import FetchHandler from "../common/FetchHandler";
import Settings from "../common/settings";
import Notifications from "../common/Notifications";
import Editor from "../editor/Editor";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, styled } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

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

const EditDialog = ({setEdit ,open, setOpen, selectedProject, setSelectedProject}) => {
    const [weldingPoints, setWeldingPoints] = useState([]);
    const [robots, setRobots] = useState([]);

    const onUpdate = () => synchronizeProject(weldingPoints)
        .then(() => Notifications.notify("Synchronized project", "success"))
        .catch((err) => Notifications.notify(`Failed to synchronize project\n${err}`));

    const closeEdit = () => {
      setSelectedProject(undefined);
      setEdit(false);
      setOpen(false);
    };

    return (
        <Dialog
          open={open}
          onClose={closeEdit}
          maxWidth={'lg'}
          fullWidth={true}
        >
          <DialogTitle>
            <h1>{selectedProject.name}</h1>
            <StyledIconButton onClick={closeEdit}>
              <CloseIcon />
            </StyledIconButton>
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
    );
};

export default EditDialog;
