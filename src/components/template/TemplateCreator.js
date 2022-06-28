import {Button, Container, Dialog, DialogTitle} from "@mui/material";
import {useState} from "react";
import TemplatePropertyEditor from "./TemplatePropertyEditor";
import FetchHandler from "../common/FetchHandler";
import Notifications from "../common/Notifications";
import Settings from "../common/settings";


const uploadTemplate = (template) => {
    const fetchProps = {
        method: "POST",
        body: JSON.stringify(template),
        headers: {"Content-Type": "application/json"}
    };
    return new Promise((resolve, reject) => {
        FetchHandler.simple(fetch(Settings.templatePath, fetchProps))
            .then(() => {
                Notifications.notify("Created Code Generation Template", "success");
                resolve();
            })
            .catch((err) => {
                Notifications.notify(`Failed to create Code Generation Template\n${err}`, "error");
                reject();
            });
    });
};

const TemplateCreator = () => {
    const [dialogOpen, setDialogOpen] = useState(false);

    const stopBubble = (evt) => {
        evt.stopPropagation();
    };

    const onClose = (evt) => {
        stopBubble(evt);
        setDialogOpen(false);
    };

    const onSubmit = (template) => {
        uploadTemplate(template)
            .then(() => setDialogOpen(false));
    };

    return (
        <>
            <Button variant="contained" onClick={() => setDialogOpen(true)}>
                Create new Code Generation Template
            </Button>

            <Dialog open={dialogOpen} onClose={onClose}>
                <DialogTitle>Create a Code Generation Template</DialogTitle>

                <Container>
                    <TemplatePropertyEditor
                        submissionText="Create"
                        onSubmit={onSubmit}
                        onCancel={onClose}
                    />
                </Container>
            </Dialog>
        </>
    );
};

export default TemplateCreator;
