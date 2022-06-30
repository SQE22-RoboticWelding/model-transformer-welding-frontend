import {
    Button,
    Divider, FormControl,
    InputLabel,
    List,
    ListItem,
    ListItemText,
    MenuItem, Paper,
    Select,
    styled,
    TextField, Tooltip
} from "@mui/material";
import {ListItemSpreadingChildren} from "../common/StyledComponents";
import {useState} from "react";

const DEFAULT_PROJECT_HELPER = "Project";
const DEFAULT_NAME_HELPER = "Name";
const DEFAULT_DESCRIPTION_HELPER = "Description";
const DEFAULT_POSITION_X_HELPER = "x";
const DEFAULT_POSITION_Y_HELPER = "y";
const DEFAULT_POSITION_Z_HELPER = "z";
const DEFAULT_POSITION_NORM_VECTOR_X_HELPER = "x";
const DEFAULT_POSITION_NORM_VECTOR_Y_HELPER = "y";
const DEFAULT_POSITION_NORM_VECTOR_Z_HELPER = "z";

const EMPTY_ROBOT = {
    name: "",
    project_id: "",
    description: "",
    position_x: "",
    position_y: "",
    position_z: "",
    position_norm_vector_x: "",
    position_norm_vector_y: "",
    position_norm_vector_z: ""
};

const CoordinateInput = styled(TextField)({
    width: "125px",
    margin: "0 4px",
    alignSelf: "baseline"
});

const DisabledButton = styled(Paper)({
    padding: "6px 8px",
    borderRadius: "8px",
    color: "red"
});

const RobotPropertyEditor = ({onSubmit, submitText, onClose, projects, robot = EMPTY_ROBOT}) => {
    const [projectId, setProjectId] = useState(robot.project_id);
    const [name, setName] = useState(robot.name);
    const [description, setDescription] = useState(robot.description);
    const [positionX, setPositionX] = useState(robot.position_x);
    const [positionY, setPositionY] = useState(robot.position_y);
    const [positionZ, setPositionZ] = useState(robot.position_z);
    const [positionNormVectorX, setPositionNormVectorX] = useState(robot.position_norm_vector_x);
    const [positionNormVectorY, setPositionNormVectorY] = useState(robot.position_norm_vector_y);
    const [positionNormVectorZ, setPositionNormVectorZ] = useState(robot.position_norm_vector_z);

    const [nameHelper, setNameHelper] = useState(DEFAULT_NAME_HELPER);
    const [projectHelper, setProjectHelper] = useState(DEFAULT_PROJECT_HELPER);
    const [positionXHelper, setPositionXHelper] = useState(DEFAULT_POSITION_X_HELPER);
    const [positionYHelper, setPositionYHelper] = useState(DEFAULT_POSITION_Y_HELPER);
    const [positionZHelper, setPositionZHelper] = useState(DEFAULT_POSITION_Z_HELPER);
    const [positionNormVectorXHelper, setPositionNormVectorXHelper] = useState(DEFAULT_POSITION_NORM_VECTOR_X_HELPER);
    const [positionNormVectorYHelper, setPositionNormVectorYHelper] = useState(DEFAULT_POSITION_NORM_VECTOR_Y_HELPER);
    const [positionNormVectorZHelper, setPositionNormVectorZHelper] = useState(DEFAULT_POSITION_NORM_VECTOR_Z_HELPER);

    const stopBubble = (evt) => {
        evt.stopPropagation();
    };

    const onValidatedSubmit = () => {
        let validated = true;

        if (isNaN(Number(projectId)) || projectId === "") {
            setProjectHelper("Project must be given");
            validated = false;
        } else {
            setProjectHelper(DEFAULT_PROJECT_HELPER);
        }

        if (!name) {
            setNameHelper("Name must be given");
            validated = false;
        } else {
            setNameHelper(DEFAULT_NAME_HELPER);
        }

        if (isNaN(Number(positionX)) || positionX === "") {
            setPositionXHelper("x must be a floating point number");
            validated = false;
        } else {
            setPositionXHelper(DEFAULT_POSITION_X_HELPER);
        }

        if (isNaN(Number(positionY)) || positionY === "") {
            setPositionYHelper("y must be a floating point number");
            validated = false;
        } else {
            setPositionYHelper(DEFAULT_POSITION_Y_HELPER);
        }

        if (isNaN(Number(positionZ)) || positionZ === "") {
            setPositionZHelper("z must be a floating point number");
            validated = false;
        } else {
            setPositionZHelper(DEFAULT_POSITION_Z_HELPER);
        }

        if (isNaN(Number(positionNormVectorX)) || positionNormVectorX === "") {
            setPositionNormVectorXHelper("x must be a floating point number");
            validated = false;
        } else {
            setPositionNormVectorXHelper(DEFAULT_POSITION_NORM_VECTOR_X_HELPER);
        }

        if (isNaN(Number(positionNormVectorY)) || positionNormVectorY === "") {
            setPositionNormVectorYHelper("y must be a floating point number");
            validated = false;
        } else {
            setPositionNormVectorYHelper(DEFAULT_POSITION_NORM_VECTOR_Y_HELPER);
        }

        if (isNaN(Number(positionNormVectorZ)) || positionNormVectorZ === "") {
            setPositionNormVectorZHelper("z must be a floating point number");
            validated = false;
        } else {
            setPositionNormVectorZHelper(DEFAULT_POSITION_NORM_VECTOR_Z_HELPER);
        }

        if (validated) {
            onSubmit({
                name, description,
                project_id: projectId,
                position_x: positionX,
                position_y: positionY,
                position_z: positionZ,
                position_norm_vector_x: positionNormVectorX,
                position_norm_vector_y: positionNormVectorY,
                position_norm_vector_z: positionNormVectorZ
            });
        }
    };

    return (
        <List onClick={stopBubble}>
            <ListItem>
                <TextField
                    variant="outlined"
                    error={DEFAULT_NAME_HELPER !== nameHelper}
                    helperText={nameHelper}
                    placeholder="Type name here ..."
                    fullWidth
                    value={name}
                    onChange={(evt) => setName(evt.target.value)}
                />
            </ListItem>

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

            <ListItem>
                {projects.length > 0 ? (
                    <FormControl fullWidth>
                        <InputLabel id="project-for-robot">{projectHelper}</InputLabel>
                        <Select
                            value={projectId}
                            error={DEFAULT_PROJECT_HELPER !== projectHelper}
                            onChange={(evt) => setProjectId(evt.target.value)}
                            labelId="project-for-robot"
                            label={projectHelper}
                        >
                            {projects.map((project) => (
                                <MenuItem value={project.id}>[{project.id}] {project.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                ) : (
                    <ListItemText>There are no projects yet.</ListItemText>
                )}
            </ListItem>

            <Divider orientation="horizontal"/>

            <ListItem>
                <ListItemText>
                    Position of the robot
                </ListItemText>
            </ListItem>

            <ListItem>
                <CoordinateInput
                    variant="outlined"
                    error={DEFAULT_POSITION_X_HELPER !== positionXHelper}
                    helperText={positionXHelper}
                    value={positionX}
                    onChange={(evt) => setPositionX(evt.target.value)}
                />

                <CoordinateInput
                    variant="outlined"
                    error={DEFAULT_POSITION_Y_HELPER !== positionYHelper}
                    helperText={positionYHelper}
                    value={positionY}
                    onChange={(evt) => setPositionY(evt.target.value)}
                />

                <CoordinateInput
                    variant="outlined"
                    error={DEFAULT_POSITION_Z_HELPER !== positionZHelper}
                    helperText={positionZHelper}
                    value={positionZ}
                    onChange={(evt) => setPositionZ(evt.target.value)}
                />
            </ListItem>

            <Divider orientation="horizontal"/>

            <ListItem>
                <ListItemText>
                    Normal vector of the robot at its position
                </ListItemText>
            </ListItem>

            <ListItem>
                <CoordinateInput
                    variant="outlined"
                    error={DEFAULT_POSITION_NORM_VECTOR_X_HELPER !== positionNormVectorXHelper}
                    helperText={positionNormVectorXHelper}
                    value={positionNormVectorX}
                    onChange={(evt) => setPositionNormVectorX(evt.target.value)}
                />

                <CoordinateInput
                    variant="outlined"
                    error={DEFAULT_POSITION_NORM_VECTOR_Y_HELPER !== positionNormVectorYHelper}
                    helperText={positionNormVectorYHelper}
                    value={positionNormVectorY}
                    onChange={(evt) => setPositionNormVectorY(evt.target.value)}
                />

                <CoordinateInput
                    variant="outlined"
                    error={DEFAULT_POSITION_NORM_VECTOR_Z_HELPER !== positionNormVectorZHelper}
                    helperText={positionNormVectorZHelper}
                    value={positionNormVectorZ}
                    onChange={(evt) => setPositionNormVectorZ(evt.target.value)}
                />
            </ListItem>

            <ListItemSpreadingChildren>
                {projects.length > 0 ? (
                    <Button variant="outlined" onClick={onValidatedSubmit}>
                        {submitText}
                    </Button>
                ) : (
                    <Tooltip title="Robot must be assigned to a project">
                        <DisabledButton variant="outlined">
                            Create
                        </DisabledButton>
                    </Tooltip>
                )}

                <Button variant="text" onClick={onClose}>
                    Cancel
                </Button>
            </ListItemSpreadingChildren>
        </List>
    );
};

export default RobotPropertyEditor;
