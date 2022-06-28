import {Button, Container, Dialog, DialogTitle, IconButton, List, ListItem, TextField, Tooltip} from "@mui/material";
import {useState} from "react";
import AddIcon from '@mui/icons-material/Add';
import FetchHandler from "../common/FetchHandler";
import Settings from "../common/settings";
import Notifications from "../common/Notifications";
import {ListItemSpreadingChildren} from "../common/StyledComponents";


const DEFAULT_DESCRIPTION_HELPER = "Description";

const uploadRobot = (robotTypeId, description) => {
    const fetchProps = {
        method: "POST",
        body: JSON.stringify({robot_type_id: robotTypeId, description}),
        headers: {"Content-Type": "application/json"}
    };
    return new Promise((resolve, reject) => FetchHandler.simple(fetch(Settings.robotPath, fetchProps))
        .then(() => {
            Notifications.notify("Created robot.", "success")
            resolve();
        })
        .catch((err) => {
            Notifications.notify(`Failed to create robot.\n${err}`, "error");
            reject();
        }));
};

const RobotCreator = ({robotTypeId, onRobotCreated}) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [description, setDescription] = useState("");

    const onClickCreate = (evt) => {
        evt.stopPropagation();
        setDialogOpen(true);
    };

    const stopBubble = (evt) => {
        evt.stopPropagation();
    };

    const onClose = (evt) => {
        stopBubble(evt);
        setDialogOpen(false);
    };

    const onSubmit = () => {
        uploadRobot(robotTypeId, description)
            .then(() => {
                setDialogOpen(false);
                onRobotCreated();
            });
    };

    return (
        <>
            <Tooltip title="Create Robot">
                <IconButton onClick={onClickCreate}>
                    <AddIcon/>
                </IconButton>
            </Tooltip>

            <Dialog open={dialogOpen} onClose={onClose}>
                <DialogTitle>Create a robot</DialogTitle>
                <Container>
                    <List onClick={stopBubble}>
                        <ListItem>
                            <TextField
                                variant="outlined"
                                helperText={DEFAULT_DESCRIPTION_HELPER}
                                placeholder="Type description here ..."
                                fullWidth
                                value={description}
                                onChange={(evt) => setDescription(evt.target.value)}
                            />
                        </ListItem>
                        <ListItemSpreadingChildren>
                            <Button variant="outlined" onClick={onSubmit}>
                                Create
                            </Button>

                            <Button variant="text" onClick={onClose}>
                                Cancel
                            </Button>
                        </ListItemSpreadingChildren>
                    </List>
                </Container>
            </Dialog>
        </>
    );
};

export default RobotCreator;
