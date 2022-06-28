import {Button, List, ListItem, TextField} from "@mui/material";
import {ListItemSpreadingChildren} from "../common/StyledComponents";
import {useState} from "react";

const DEFAULT_DESCRIPTION_HELPER = "Description";

const EMPTY_ROBOT = {
    description: ""
};

const RobotPropertyEditor = ({onSubmit, submitText, onClose, robot = EMPTY_ROBOT}) => {
    const [description, setDescription] = useState(robot.description);

    const stopBubble = (evt) => {
        evt.stopPropagation();
    };

    return (
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
                <Button variant="outlined" onClick={() => onSubmit({description})}>
                    {submitText}
                </Button>

                <Button variant="text" onClick={onClose}>
                    Cancel
                </Button>
            </ListItemSpreadingChildren>
        </List>
    );
};

export default RobotPropertyEditor;
