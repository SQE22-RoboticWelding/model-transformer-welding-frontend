import Notifications from "../common/Notifications";
import {Button, Dialog, DialogContent, DialogTitle, IconButton, styled} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Settings from "../common/settings";
import { useEffect, useState } from "react";
import FetchHandler from "../common/FetchHandler";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

const GenerateDialogRoot = styled("div")({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",

  "> *": {
    marginBottom: "16px",
  }
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
    const [validated, setValidated] = useState(false);

    useEffect(() => {
        FetchHandler.simple(fetch(Settings.validateGeneratePath(selectedProject.id), {method: "GET"}))
            .then(() => setValidated(true))
            .catch((err) => {
                Notifications.notify(`Generation validation failed\n${err}`, "error");
                setValidated(false);
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
                    {validated ? (
                        <Button variant="contained" size="medium" endIcon={<FileDownloadIcon/>}
                                href={Settings.generatePath(selectedProject.id)}>
                            Download
                        </Button>
                    ) : (
                        <Button variant="contained" size="medium" endIcon={<FileDownloadIcon/>} disabled>
                            Download
                        </Button>
                    )}
                </StyledDialogContent>
            </Dialog>
        </GenerateDialogRoot>
    );
};

export default EditDialog;
