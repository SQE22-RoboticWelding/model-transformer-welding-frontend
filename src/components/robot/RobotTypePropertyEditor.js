import {
    Button,
    Container,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Select,
    TextField
} from "@mui/material";
import {useEffect, useState} from "react";
import {ListItemSpreadingChildren} from "../common/StyledComponents";
import FetchHandler from "../common/FetchHandler";
import Settings from "../common/settings";
import Notifications from "../common/Notifications";
import FileUtils from "../common/FileUtils";
import FileDownloadIcon from "@mui/icons-material/FileDownload";


const DEFAULT_NAME_HELPER = "Name";
const DEFAULT_VENDOR_HELPER = "Vendor";
const DEFAULT_CAPACITY_HELPER = "Capacity in kilograms";
const DEFAULT_RANGE_HELPER = "Range in meters";
const DEFAULT_GENERATION_TEMPLATE_HELPER = "Generation Template";

const EMPTY_ROBOT_TYPE = {
    name: "",
    vendor: "",
    model_file_name: "",
    model_file: "",
    capacity: "",
    range: "",
    generation_template_id: ""
};

const RobotTypePropertyEditor = ({onSubmit, submissionText, onCancel, robotType = EMPTY_ROBOT_TYPE}) => {
    const [name, setName] = useState(robotType.name);
    const [nameHelper, setNameHelper] = useState(DEFAULT_NAME_HELPER);

    const [vendor, setVendor] = useState(robotType.vendor);
    const [vendorHelper, setVendorHelper] = useState(DEFAULT_VENDOR_HELPER);

    const [capacity, setCapacity] = useState(robotType.capacity_load_kg);
    const [capacityHelper, setCapacityHelper] = useState(DEFAULT_CAPACITY_HELPER);

    const [range, setRange] = useState(robotType.range_m);
    const [rangeHelper, setRangeHelper] = useState(DEFAULT_RANGE_HELPER);

    const [modelFileName, setModelFileName] = useState(robotType.model_file ? "Downloadable" : "");
    const [modelFileContent, setModelFileContent] = useState(robotType.model_file);

    const [generationTemplateRetrievalState, setGenerationTemplateRetrievalState] = useState("idle");
    const [generationTemplates, setGenerationTemplates] = useState([]);
    const [generationTemplateId, setGenerationTemplateId] = useState(robotType.generation_template_id);

    const retrieveGenerationTemplates = () => {
        setGenerationTemplateRetrievalState("loading");
        FetchHandler.readingJson(fetch(Settings.templatePath, {method: "GET"}))
            .then((templates) => {
                setGenerationTemplates(templates);
            })
            .catch((err) => {
                Notifications.notify(`Failed to get generation templates\n${err}`, "error");
            })
            .finally(() => setGenerationTemplateRetrievalState("idle"));
    };

    const stopBubble = (evt) => {
        evt.stopPropagation();
    };

    const onValidatedSubmit = (evt) => {
        evt.stopPropagation();
        let validated = true;
        if (!name) {
            setNameHelper("Name must be given");
            validated = false;
        } else {
            setNameHelper(DEFAULT_NAME_HELPER);
        }
        if (!vendor) {
            setVendorHelper("Vendor must be given");
            validated = false;
        } else {
            setVendorHelper(DEFAULT_VENDOR_HELPER);
        }
        if (isNaN(Number(capacity)) && capacity !== undefined) {
            setCapacityHelper("Capacity must be a floating point number");
            validated = false;
        } else {
            setCapacityHelper(DEFAULT_CAPACITY_HELPER);
        }
        if (isNaN(Number(range)) && range !== undefined) {
            setRangeHelper("Range must be a floating point number");
            validated = false;
        } else {
            setRangeHelper(DEFAULT_RANGE_HELPER);
        }

        if (validated) {
            if (modelFileName) {
                onSubmit({name, vendor, capacity, range, generationTemplateId, modelFileName, modelFileContent});
            } else {
                onSubmit({name, vendor, capacity, range, generationTemplateId});
            }
        }
    };

    const handleFileUpload = (evt) => {
        FileUtils.handleFileUpload(evt)
            .then(({name, content}) => {
                setModelFileName(name);
                setModelFileContent(content);
            });
    }

    useEffect(() => retrieveGenerationTemplates(), []);

    return (
        <List onClick={stopBubble}>
            <Container>
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
                        error={DEFAULT_VENDOR_HELPER !== vendorHelper}
                        helperText={vendorHelper}
                        placeholder="Type vendor here ..."
                        fullWidth
                        value={vendor}
                        onChange={(evt) => setVendor(evt.target.value)}
                    />
                </ListItem>

                <ListItem>
                    <TextField
                        variant="outlined"
                        error={DEFAULT_CAPACITY_HELPER !== capacityHelper}
                        helperText={capacityHelper}
                        placeholder="Type capacity here ..."
                        fullWidth
                        InputProps={{endAdornment: <InputAdornment position="end">kg</InputAdornment>}}
                        value={capacity}
                        onChange={(evt) => setCapacity(evt.target.value)}
                    />
                </ListItem>

                <ListItem>
                    <TextField
                        variant="outlined"
                        error={DEFAULT_RANGE_HELPER !== rangeHelper}
                        helperText={rangeHelper}
                        placeholder="Type range here ..."
                        fullWidth
                        InputProps={{endAdornment: <InputAdornment position="end">m</InputAdornment>}}
                        value={range}
                        onChange={(evt) => setRange(evt.target.value)}
                    />
                </ListItem>

                <ListItem>
                    {generationTemplateRetrievalState === "loading" ? (
                        <ListItemText>Loading...</ListItemText>
                    ) : generationTemplates.length > 0 ? (
                        <FormControl fullWidth>
                            <InputLabel id="generation-template-for-robot-type">
                                {DEFAULT_GENERATION_TEMPLATE_HELPER}
                            </InputLabel>
                            <Select
                                value={generationTemplateId}
                                onChange={(evt) => setGenerationTemplateId(evt.target.value)}
                                labelId="generation-template-for-robot-type"
                                label={DEFAULT_GENERATION_TEMPLATE_HELPER}
                            >
                                {generationTemplates.map((template) => (
                                    <MenuItem key={template.id} value={template.id}>
                                        {template.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    ) : (
                        <ListItemText>There are no Generation Templates yet.</ListItemText>
                    )}
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
                        disabled={!modelFileContent}
                        href={FileUtils.toDownloadableFle(modelFileName, modelFileContent)}
                        download={modelFileName}
                    >
                        <FileDownloadIcon/>
                    </IconButton>
                </ListItem>
            </Container>

            <ListItemSpreadingChildren>
                <Button variant="outlined" onClick={onValidatedSubmit}>
                    {submissionText}
                </Button>

                <Button variant="text" onClick={onCancel}>
                    Cancel
                </Button>
            </ListItemSpreadingChildren>
        </List>
    );
};

export default RobotTypePropertyEditor;
