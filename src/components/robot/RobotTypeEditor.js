import {Dialog, DialogTitle, IconButton, Tooltip} from "@mui/material";
import {useState} from "react";
import FetchHandler from "../common/FetchHandler";
import Settings from "../common/settings";
import Notifications from "../common/Notifications";
import RobotTypePropertyEditor from "./RobotTypePropertyEditor";
import EditIcon from "@mui/icons-material/Edit";


const updateRobotType = ({id, name, vendor, capacity, range, generationTemplateId, modelFileName, modelFileContent}) => {
    const requestBody = {
        id, name, vendor,
        model_file_name: modelFileName || null,
        model_file: modelFileContent || null,
        capacity_load_kg: capacity === "" ? null : capacity,  // cannot use || here because 0 is valid too
        range_m: range === "" ? null : range,  // cannot use || here because 0 is valid too
        generation_template_id: generationTemplateId === "" ? null : generationTemplateId
    };
    const fetchProps = {
        method: "PUT",
        body: JSON.stringify(requestBody),
        headers: {"Content-Type": "application/json"}
    };
    return new Promise((resolve, reject) => {
        FetchHandler.simple(fetch(`${Settings.robotTypePath}/${id}`, fetchProps))
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
            <Tooltip title="Edit Robot Type">
                <IconButton onClick={onClickEdit}>
                    <EditIcon color="info"/>
                </IconButton>
            </Tooltip>

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
