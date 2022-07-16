import {Container, Dialog, DialogTitle, IconButton, Tooltip} from "@mui/material";
import {useState} from "react";
import FetchHandler from "../common/FetchHandler";
import Settings from "../common/settings";
import Notifications from "../common/Notifications";
import EditIcon from "@mui/icons-material/Edit";
import RobotPropertyEditor from "./RobotPropertyEditor";


const updateRobot = (id, robot) => {
    const fetchProps = {
        method: "PUT",
        body: JSON.stringify(robot),
        headers: {"Content-Type": "application/json"}
    };
    return new Promise((resolve, reject) => {
        FetchHandler.simple(fetch(`${Settings.robotPath}/${id}`, fetchProps))
            .then(() => {
                Notifications.notify("Saved robot.", "success");
                resolve();
            })
            .catch((err) => {
                Notifications.notify(`Failed to save robot.\n${err}`, "error");
                reject();
            });
    });
};

const RobotEditor = ({robot, onRobotUpdated, projects}) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    const onSubmit = (updatedRobot) => {
        updateRobot(robot.id, {...robot, ...updatedRobot})
            .then(() => {
                setDialogOpen(false);
                onRobotUpdated();
            });
    };

    const onClickUpdate = () => setDialogOpen(true);

    const onClose = () => setDialogOpen(false);

    return (
        <>
            <Tooltip title="Update Robot">
                <IconButton onClick={onClickUpdate}>
                    <EditIcon color="info"/>
                </IconButton>
            </Tooltip>

            <Dialog open={dialogOpen} onClose={onClose}>
                <DialogTitle>Update Robot</DialogTitle>

                <Container>
                    <RobotPropertyEditor
                        onSubmit={onSubmit}
                        onClose={onClose}
                        submitText="Save"
                        projects={projects}
                        robot={robot}
                    />
                </Container>
            </Dialog>
        </>
    );
};

export default RobotEditor;
