import {Dialog, DialogTitle, IconButton} from "@mui/material";
import {useState} from "react";
import FetchHandler from "../common/FetchHandler";
import Settings from "../common/settings";
import Notifications from "../common/Notifications";
import RobotPropertyEditor from "./RobotPropertyEditor";
import EditIcon from "@mui/icons-material/Edit";


const updateRobotType = (id, name, vendor, capacity, range) => {
    const requestBody = {
        id, name, vendor,
        ...(capacity && {capacity}),
        ...(range && {range})
    };
    const fetchProps = {
        method: "PUT",
        body: JSON.stringify(requestBody),
        headers: {"Content-Type": "application/json"}
    };
    return new Promise((resolve, reject) => {
        FetchHandler.simple(fetch(Settings.robotTypePath, fetchProps))
            .then(() => Notifications.notify("Updated Robot Type", "success"))
            .catch((err) => {
                Notifications.notify(`Unable to update robot type\n${err}`, "error");
                reject();
            });
    });
};

const RobotTypeEditor = ({onRequestRobotTypeRefresh, robotType}) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    const onSubmit = (updates) => {
        updateRobotType({...robotType, updates})
            .then(() => setDialogOpen(false));
        onRequestRobotTypeRefresh();
    };

    const onClickEdit = (evt) => {
        evt.stopPropagation();
        setDialogOpen(true)
    };

    return (
        <>
            <IconButton variant="contained" onClick={onClickEdit}>
                <EditIcon/>
            </IconButton>

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Update a Robot Type</DialogTitle>

                <RobotPropertyEditor onSubmit={onSubmit} submissionText="Update"/>
            </Dialog>
        </>
    );
};

export default RobotTypeEditor;