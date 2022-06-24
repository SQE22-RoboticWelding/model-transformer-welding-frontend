import {Button, Dialog, DialogTitle} from "@mui/material";
import {useState} from "react";
import FetchHandler from "../common/FetchHandler";
import Settings from "../common/settings";
import Notifications from "../common/Notifications";
import RobotTypePropertyEditor from "./RobotTypePropertyEditor";


const uploadRobotType = (robotType) => {
    const requestBody = {
        name: robotType.name,
        vendor: robotType.vendor,
        ...(robotType.capacity && {capacity: robotType.capacity}),
        ...(robotType.range && {range: robotType.range})
    };
    const fetchProps = {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {"Content-Type": "application/json"}
    };
    return new Promise((resolve, reject) => {
        FetchHandler.simple(fetch(Settings.robotTypePath, fetchProps))
            .then(() => {
                Notifications.notify("Created Robot Type", "success");
                resolve();
            })
            .catch((err) => {
                Notifications.notify(`Unable to create robot type\n${err}`, "error");
                reject();
            });
    });
};

const RobotCreator = ({onRequestRobotTypeRefresh}) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    const onSubmit = (creates) => {
        uploadRobotType(creates)
            .then(() => {
                setDialogOpen(false);
                onRequestRobotTypeRefresh();
            });
    };

    return (
        <>
            <Button variant="contained" onClick={() => setDialogOpen(true)}>
                Create a new Robot Type
            </Button>

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Create a Robot Type</DialogTitle>

                <RobotTypePropertyEditor
                    onSubmit={onSubmit}
                    submissionText="Create"
                    onCancel={() => setDialogOpen(false)}
                />
            </Dialog>
        </>
    );
};

export default RobotCreator;
