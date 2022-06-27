import {Dialog, DialogTitle, IconButton} from "@mui/material";
import {useState} from "react";
import FetchHandler from "../common/FetchHandler";
import Settings from "../common/settings";
import Notifications from "../common/Notifications";
import RobotTypePropertyEditor from "./RobotTypePropertyEditor";
import EditIcon from "@mui/icons-material/Edit";


const updateRobotType = ({id, name, vendor, capacity, range}) => {
    const requestBody = {
        id, name, vendor,
        capacity_load_kg: capacity === "" ? null : capacity,
        range_m: range === "" ? null : range
    };
    const fetchProps = {
        method: "PUT",
        body: JSON.stringify(requestBody),
        headers: {"Content-Type": "application/json"}
    };
    const urlParams = new URLSearchParams({_id: id});
    return new Promise((resolve, reject) => {
        FetchHandler.simple(fetch(`${Settings.robotTypePath}/:id/?${urlParams}`, fetchProps))
            .then(() => {
                Notifications.notify("Updated Robot Type", "success");
                resolve();
            })
            .catch((err) => {
                Notifications.notify(`Unable to update robot type\n${err}`, "error");
                reject();
            });
    });
};

const RobotTypeEditor = ({onRequestRobotTypeRefresh, robotType}) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    const onSubmit = (updates) => {
        updateRobotType({...robotType, ...updates})
            .then(() => {
                setDialogOpen(false);
                onRequestRobotTypeRefresh();
            });
    };

    const onClickEdit = (evt) => {
        evt.stopPropagation();
        setDialogOpen(true)
    };

    const onClose = (evt) => {
        evt.stopPropagation();
        setDialogOpen(false);
    };

    return (
        <>
            <IconButton onClick={onClickEdit}>
                <EditIcon/>
            </IconButton>

            <Dialog open={dialogOpen} onClose={onClose}>
                <DialogTitle>Update a Robot Type</DialogTitle>

                <RobotTypePropertyEditor
                    onSubmit={onSubmit}
                    robotType={robotType}
                    submissionText="Update"
                    onCancel={onClose}
                />
            </Dialog>
        </>
    );
};

export default RobotTypeEditor;
