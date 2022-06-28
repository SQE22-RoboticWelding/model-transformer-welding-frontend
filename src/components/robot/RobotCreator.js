import {Container, Dialog, DialogTitle, IconButton, Tooltip} from "@mui/material";
import {useState} from "react";
import AddIcon from '@mui/icons-material/Add';
import FetchHandler from "../common/FetchHandler";
import Settings from "../common/settings";
import Notifications from "../common/Notifications";
import RobotPropertyEditor from "./RobotPropertyEditor";


const uploadRobot = (robotTypeId, {description}) => {
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

    const onClickCreate = (evt) => {
        evt.stopPropagation();
        setDialogOpen(true);
    };

    const onClose = () => {
        setDialogOpen(false);
    };

    const onSubmit = (robot) => {
        uploadRobot(robotTypeId, robot)
            .then(() => {
                setDialogOpen(false);
                onRobotCreated();
            });
    };

    return (
        <>
            <Tooltip title="Create Robot">
                <IconButton onClick={onClickCreate}>
                    <AddIcon color="success"/>
                </IconButton>
            </Tooltip>

            <Dialog open={dialogOpen} onClose={onClose}>
                <DialogTitle>Create a robot</DialogTitle>
                <Container>
                    <RobotPropertyEditor
                        onSubmit={onSubmit}
                        onClose={onClose}
                        submitText="Create"
                    />
                </Container>
            </Dialog>
        </>
    );
};

export default RobotCreator;
