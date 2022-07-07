import {
    Button,
    Container,
    Dialog,
    DialogTitle,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Tooltip,
    Typography
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {ListItemSpreadingChildren} from "../common/StyledComponents";
import {useState} from "react";
import FetchHandler from "../common/FetchHandler";
import Settings from "../common/settings";
import Notifications from "../common/Notifications";


const deleteTemplate = (id) => {
    return new Promise((resolve, reject) => {
        FetchHandler.simple(fetch(`${Settings.templatePath}/${id}`, {method: "DELETE"}))
            .then(() => {
                Notifications.notify("Removed template.", "success");
                resolve();
            })
            .catch((err) => {
                Notifications.notify(`Failed to remove template.\n${err}`, "error");
                reject();
            });
    });
};

const TemplateDeletor = ({template, onTemplateDeleted}) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    const onConfirmDelete = () => {
        deleteTemplate(template.id)
            .then(() => {
                setDialogOpen(false);
                onTemplateDeleted();
            });
    };

    const stopBubble = (evt) => {
        evt.stopPropagation();
    };

    const onClickDelete = (evt) => {
        stopBubble(evt);
        setDialogOpen(true);
    };

    const onClose = (evt) => {
        stopBubble(evt);
        setDialogOpen(false);
    };

    return (
        <>
            <Tooltip title="Delete Template">
                <IconButton onClick={onClickDelete}>
                    <DeleteIcon color="error"/>
                </IconButton>
            </Tooltip>

            <Dialog open={dialogOpen} onClose={onClose}>
                <DialogTitle onClick={stopBubble}>
                    Delete Template <i>{template.name}</i>
                </DialogTitle>

                <Container onClick={stopBubble}>
                    <List>
                        <ListItemText>
                            Are you sure you want to delete this template?
                        </ListItemText>

                        <ListItem>
                            <Typography style={{color: "red"}} variant="caption">
                                This action cannot be undone.
                            </Typography>
                        </ListItem>

                        <ListItemSpreadingChildren>
                            <Button variant="contained" color="error" onClick={onConfirmDelete}>
                                Yes
                            </Button>

                            <Button variant="outlined" onClick={() => setDialogOpen(false)}>
                                No, go back
                            </Button>
                        </ListItemSpreadingChildren>
                    </List>
                </Container>
            </Dialog>
        </>
    );
};

export default TemplateDeletor;
