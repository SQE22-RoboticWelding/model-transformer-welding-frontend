import {useState} from "react";
import {Button, Dialog, DialogContent, DialogTitle} from "@mui/material";
import FileUpload from "./FileUpload";

const ProjectCreator = ({onCreated}) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    return (
        <>
            <Button variant="contained" onClick={() => setDialogOpen(true)}>
                Create a new Project
            </Button>

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Create a Project</DialogTitle>

                <DialogContent>
                    <FileUpload onCreated={() => {
                        onCreated();
                        setDialogOpen(false);
                    }}/>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ProjectCreator;
