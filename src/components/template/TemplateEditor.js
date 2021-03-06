import {Container, Dialog, DialogTitle, IconButton, Tooltip} from "@mui/material";
import {useState} from "react";
import FetchHandler from "../common/FetchHandler";
import Settings from "../common/settings";
import Notifications from "../common/Notifications";
import EditIcon from "@mui/icons-material/Edit";
import TemplatePropertyEditor from "./TemplatePropertyEditor";


const updateTemplate = (id, template) => {
    const fetchProps = {
        method: "PUT",
        body: JSON.stringify(template),
        headers: {"Content-Type": "application/json"}
    };
    return new Promise((resolve, reject) => {
        FetchHandler.simple(fetch(`${Settings.templatePath}/${id}`, fetchProps))
            .then(() => {
                Notifications.notify("Saved template.", "success");
                resolve();
            })
            .catch((err) => {
                Notifications.notify(`Failed to save template.\n${err}`, "error");
                reject();
            });
    });
};

const RobotEditor = ({template, onTemplateUpdated}) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    const stopBubble = (evt) => {
        evt.stopPropagation();
    };

    const onSubmit = (updatedTemplate) => {
        updateTemplate(template.id, {...template, ...updatedTemplate})
            .then(() => {
                setDialogOpen(false);
                onTemplateUpdated();
            });
    };

    const onClickUpdate = (evt) => {
        stopBubble(evt);
        setDialogOpen(true)
    };

    const onClose = (evt) => {
        stopBubble(evt);
        setDialogOpen(false);
    };

    return (
        <>
            <Tooltip title="Update Template">
                <IconButton onClick={onClickUpdate}>
                    <EditIcon color="info"/>
                </IconButton>
            </Tooltip>

            <Dialog open={dialogOpen} onClose={onClose} fullWidth>
                <DialogTitle onClick={stopBubble}>
                    Update Template
                </DialogTitle>

                <Container onClick={stopBubble}>
                    <TemplatePropertyEditor
                        template={template}
                        onSubmit={onSubmit}
                        onCancel={onClose}
                        submissionText="Save"
                    />
                </Container>
            </Dialog>
        </>
    );
};

export default RobotEditor;
