import {Button, Dialog, DialogTitle} from "@mui/material";
import {useState} from "react";
import FetchHandler from "../common/FetchHandler";
import Settings from "../common/settings";
import Notifications from "../common/Notifications";
import RobotTypePropertyEditor from "./RobotTypePropertyEditor";


const uploadRobotType = ({name, vendor, capacity, range, generationTemplateId, modelFileName, modelFileContent}) => {
    const requestBody = {
        name,
        vendor,
        model_file_name: modelFileName,
        model_file: modelFileContent,
        capacity_load_kg: capacity === "" ? null : capacity,
        range_m: range === "" ? null : range,
        generation_template_id: generationTemplateId === "" ? null : generationTemplateId
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

const RobotTypeCreator = ({onRequestRobotTypeRefresh}) => {
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

export default RobotTypeCreator;
