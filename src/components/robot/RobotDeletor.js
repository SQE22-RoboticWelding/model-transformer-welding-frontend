import {
    Button,
    Container,
    Dialog,
    DialogTitle,
    IconButton,
    List,
    ListItem,
    ListItemText, Tooltip,
    Typography
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {useState} from "react";
import FetchHandler from "../common/FetchHandler";
import Settings from "../common/settings";
import Notifications from "../common/Notifications";
import {ListItemSpreadingChildren} from "../common/StyledComponents";


const deleteRobot = (id) => {
    const urlParams = new URLSearchParams({_id: id});
    return new Promise((resolve, reject) => {
        FetchHandler.simple(fetch(`${Settings.robotPath}/:id?${urlParams}`, {method: "DELETE"}))
            .then(() => {
                Notifications.notify("Removed robot.", "success");
                resolve();
            })
            .catch((err) => {
                Notifications.notify(`Failed to remove robot.\n${err}`, "error");
                reject();
            });
    });
};

const RobotDeletor = ({robot, onRobotDeleted}) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    const onConfirmDelete = () => {
        deleteRobot(robot.id)
            .then(() => {
                setDialogOpen(false);
                onRobotDeleted();
            });
    };

    const onClickDelete = () => setDialogOpen(true);

    return (
        <>
            <Tooltip title="Delete Robot">
                <IconButton onClick={onClickDelete}>
                    <DeleteIcon/>
                </IconButton>
            </Tooltip>

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Delete Robot</DialogTitle>

                <Container>
                    <List>
                        <ListItemText>
                            Are you sure you want to delete this robot?
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

export default RobotDeletor;
