import {
    Button,
    Container,
    Dialog,
    DialogTitle, Icon,
    IconButton,
    List,
    ListItem,
    ListItemText, Tooltip,
    Typography
} from "@mui/material";
import {useState} from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import {ListItemSpreadingChildren} from "../common/StyledComponents";
import FetchHandler from "../common/FetchHandler";
import Settings from "../common/settings";
import Notifications from "../common/Notifications";


const deleteRobotType = (id) => {
    const fetchProps = {
        method: "DELETE",
        headers: {"Content-Type": "application/json"}
    };
    const urlParams = new URLSearchParams({_id: id});
    return new Promise((resolve, reject) => {
        FetchHandler.simple(fetch(`${Settings.robotTypePath}/:id/?${urlParams}`, fetchProps))
            .then(() => {
                Notifications.notify("Robot Type deleted", "success");
                resolve();
            })
            .catch((err) => {
                Notifications.notify(`Failed to delete Robot Type\n${err}`, "error");
                reject();
            })
    });
};

const RobotTypeDeletor = ({robotType, onRobotTypeDeleted, canDelete}) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    const stopBubble = (evt) => {
        evt.stopPropagation();
    };

    const onConfirmDelete = () => {
        deleteRobotType(robotType.id)
            .then(() => {
                setDialogOpen(false);
                onRobotTypeDeleted();
            });
    };

    const onClose = (evt) => {
        stopBubble(evt);
        setDialogOpen(false);
    };

    const onClickDelete = (evt) => {
        stopBubble(evt);
        setDialogOpen(true);
    };

    return (
        <>
            {canDelete ? (
                <Tooltip title="Delete Robot Type">
                    <IconButton onClick={onClickDelete} color="error">
                        <DeleteIcon/>
                    </IconButton>
                </Tooltip>
            ) : (
                <Tooltip title="Delete disabled for non-empty Robot Type">
                    <Icon style={{margin: "8px"}} onClick={stopBubble}>
                        <DeleteIcon color="disabled"/>
                    </Icon>
                </Tooltip>
            )}

            <Dialog open={dialogOpen} onClose={onClose}>
                <DialogTitle>Delete Robot Type <i>{robotType.name}</i></DialogTitle>

                <Container onClick={stopBubble}>
                    <List>
                        <ListItemText>
                            Are you sure you want to delete this robot type?
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

                            <Button variant="outlined" onClick={onClose}>
                                No, go back
                            </Button>
                        </ListItemSpreadingChildren>
                    </List>
                </Container>
            </Dialog>
        </>
    );
};

export default RobotTypeDeletor;
