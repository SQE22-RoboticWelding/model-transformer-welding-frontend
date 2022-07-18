import Notifications from "../common/Notifications";
import {Button, Dialog, DialogContent, DialogTitle, IconButton, styled} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Settings from "../common/settings";
import { useEffect, useState } from "react";
import FetchHandler from "../common/FetchHandler";

const GenerateDialogRoot = styled('div')({
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
    display: 'flex',

    ':hover': {
        backgroundColor: '#BFBFBF',
    },
});

const StyledA = styled('a')({
  textDecoration: "none",
});

const StyledDialogTitle = styled(DialogTitle)({
    display: "flex",
    justifyContent: "space-between"
});

const StyledDialogContent = styled(DialogContent)({
    display: "flex",
    justifyContent: "center"
});

const EditDialog = ({open, setOpen, selectedProject, setSelectedProject}) => {
    const [projectRetrievalState, setProjectRetrievalState] = useState("loading");

    useEffect(() => {
        FetchHandler.simple(fetch(Settings.generateValidatePath(selectedProject.id), {method: "GET"}))
            .then(() => {
                setProjectRetrievalState("success");
            })
            .catch((err) => {
                Notifications.notify(`Failed to retrieve data\n${err}`, "error");
                setProjectRetrievalState("failed");
            });
      }, [selectedProject]);

    const closeGenerate = () => {
        setSelectedProject(undefined);
        setOpen(false);
    };

    return (
        <GenerateDialogRoot>
            <Dialog
                open={open}
                onClose={closeGenerate}
                maxWidth="xs"
                fullWidth={true}
            >
                <StyledDialogTitle>
                    <b>{selectedProject.name}</b>
                    <IconButton onClick={closeGenerate}>
                        <CloseIcon/>
                    </IconButton>
                </StyledDialogTitle>
                <StyledDialogContent dividers>
                    {(projectRetrievalState === "success") ? (
                        <StyledA href={`${Settings.generatePath(selectedProject.id)}`} download>
                            <StyledButton>
                                Download
                            </StyledButton>
                        </StyledA>
                    ) : projectRetrievalState === "failed" ? (
                        <p>
                            Failed to retrieve data.
                        </p>
                    ) : projectRetrievalState === "loading" &&
                        <p>Loading...</p>
                    }
                </StyledDialogContent>
            </Dialog>
        </GenerateDialogRoot>
    );
};

export default EditDialog;
