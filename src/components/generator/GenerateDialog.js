import {useEffect, useState} from "react";
import FetchHandler from "../common/FetchHandler";
import Settings from "../common/settings";
import Notifications from "../common/Notifications";
import { Button, Dialog, DialogContent, DialogTitle, IconButton, styled } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const StyledButton = styled(Button)({
    cursor: 'pointer',
    width: '128px',
    display: 'flex',

    ':hover': {
      backgroundColor: '#BFBFBF',
    },
});

const StyledIconButton = styled(IconButton)({
    position: 'absolute',
    top: 10,
    right: 0,
  });

const EditDialog = ({setGenerate ,open, setOpen, selectedProject, setSelectedProject}) => {

    const closeGenerate = () => {
      setSelectedProject(undefined);
      setOpen(false);
      setGenerate(false);
    };

    return (
        <Dialog
        open={open}
        onClose={closeGenerate}
        maxWidth={'xs'}
        fullWidth={true}
        >
          <DialogTitle>
            <h1>{selectedProject.name}</h1>
            <StyledIconButton onClick={closeGenerate}>
              <CloseIcon />
            </StyledIconButton>
          </DialogTitle>
          <DialogContent dividers>
            <StyledButton onClick={() => Notifications.notify("Not implemented yet", "warning")}>
              Download
            </StyledButton>
          </DialogContent>
        </Dialog>
    );
};

export default EditDialog;
