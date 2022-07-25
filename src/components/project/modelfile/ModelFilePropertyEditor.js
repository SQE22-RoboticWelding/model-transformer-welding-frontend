import {Button, Grid, IconButton, List, ListItem, TextField} from "@mui/material";
import {useEffect, useState} from "react";
import FileUtils from "../../common/FileUtils";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FetchHandler from "../../common/FetchHandler";
import Settings from "../../common/settings";
import Notifications from "../../common/Notifications";

const DEFAULT_POSITION_X_HELPER = "x";
const DEFAULT_POSITION_Y_HELPER = "y";
const DEFAULT_POSITION_Z_HELPER = "z";

const ModelFilePropertyEditor = ({project, onUpdate}) => {
    const [positionX, setPositionX] = useState(project.workpiece ? project.workpiece.position_x || "" : "");
    const [positionY, setPositionY] = useState(project.workpiece ? project.workpiece.position_y || "" : "");
    const [positionZ, setPositionZ] = useState(project.workpiece ? project.workpiece.position_z || "" : "");
    const [modelFileName, setModelFileName] = useState(project.workpiece ? project.workpiece.model_file_name || "" : "");
    const [modelFileContent, setModelFileContent] = useState("");

    const [positionXHelper, setPositionXHelper] = useState(DEFAULT_POSITION_X_HELPER);
    const [positionYHelper, setPositionYHelper] = useState(DEFAULT_POSITION_Y_HELPER);
    const [positionZHelper, setPositionZHelper] = useState(DEFAULT_POSITION_Z_HELPER);


    const handleFileUpload = (evt) => {
        FileUtils.handleFileUpload(evt)
            .then(({name, content}) => {
                setModelFileName(name);
                setModelFileContent(content);
            });
    }
    
    const onValidatedSubmit = () => {
        let validated = true;
        
        if (positionX === "" || !isNaN(positionX)) {
            setPositionXHelper(DEFAULT_POSITION_X_HELPER);
        } else {
            validated = false;
            setPositionXHelper("x must be empty or a valid number");
        }
        
        if (positionY === "" || !isNaN(positionY)) {
            setPositionYHelper(DEFAULT_POSITION_Y_HELPER);
        } else {
            validated = false;
            setPositionYHelper("y must be empty or a valid number");
        }
        
        if (positionZ === "" || !isNaN(positionZ)) {
            setPositionZHelper(DEFAULT_POSITION_Z_HELPER);
        } else {
            validated = false;
            setPositionZHelper("z must be empty or a valid number");
        }

        if (validated) {
            const requestProps = {
                method: "PUT",
                body: JSON.stringify({
                    position_x: positionX,
                    position_y: positionY,
                    position_z: positionZ,
                    model_file_name: modelFileName,
                    model_file: modelFileContent
                }),
                headers: {"Content-Type": "application/json"}
            };

            FetchHandler.simple(fetch(`${Settings.workpiecePath}/${project.workpiece.id}`, requestProps))
                .then(() => {
                    Notifications.notify("Saved workpiece", "success");
                    onUpdate();
                })
                .catch((err) => Notifications.notify(`Failed to save workpiece\n${err}`, "error"))
        }
    };

    useEffect(() => {
        if (project.workpiece) {
            FetchHandler.readingJson(fetch(`${Settings.workPieceModelPath(project.workpiece.id)}`, {method: "GET"}))
                .then((content) => setModelFileContent(content))
                .catch((err) => Notifications.notify(`Failed to retrieve model file contents\n${err}`, "error"));
        }
    }, [project.modified_at, project.workpiece]);

    return (
        <Grid container display="flex" flexDirection="column" alignItems="center">
            <List>
                <ListItem>
                    <TextField
                        variant="outlined"
                        error={DEFAULT_POSITION_X_HELPER !== positionXHelper}
                        helperText={positionXHelper}
                        value={positionX}
                        onChange={(evt) => setPositionX(evt.target.value)}
                    />
                </ListItem>

                <ListItem>
                    <TextField
                        variant="outlined"
                        error={DEFAULT_POSITION_Y_HELPER !== positionYHelper}
                        helperText={positionYHelper}
                        value={positionY}
                        onChange={(evt) => setPositionY(evt.target.value)}
                    />
                </ListItem>

                <ListItem>
                    <TextField
                        variant="outlined"
                        error={DEFAULT_POSITION_Z_HELPER !== positionZHelper}
                        helperText={positionZHelper}
                        value={positionZ}
                        onChange={(evt) => setPositionZ(evt.target.value)}
                    />
                </ListItem>

                <ListItem>
                    <Button component="label" variant="outlined" fullWidth>
                        Upload Local Model File
                        <input type="file" hidden onChange={handleFileUpload}/>
                    </Button>
                </ListItem>

                <ListItem>
                    <TextField
                        disabled
                        fullWidth
                        label="File name"
                        value={modelFileName}
                    />

                    <IconButton
                        disabled={!modelFileName}
                        href={FileUtils.toDownloadableFile(modelFileName, modelFileContent)}
                        download={modelFileName}
                        target="_blank"
                    >
                        <FileDownloadIcon/>
                    </IconButton>
                </ListItem>

                <ListItem>
                    <Button variant="outlined" onClick={onValidatedSubmit}>
                        Save
                    </Button>
                </ListItem>
            </List>
        </Grid>
    );
};

export default ModelFilePropertyEditor;
