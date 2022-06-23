import {Button, Container, InputAdornment, List, ListItem, TextField} from "@mui/material";
import {useState} from "react";


const DEFAULT_NAME_HELPER = "Name";
const DEFAULT_VENDOR_HELPER = "Vendor";
const DEFAULT_CAPACITY_HELPER = "Capacity in kilograms";
const DEFAULT_RANGE_HELPER = "Range in meters";

const EMPTY_ROBOT_TYPE = {
    name: "",
    vendor: "",
    capacity: "",
    range: ""
};

const RobotPropertyEditor = ({onSubmit, submissionText, robotType = EMPTY_ROBOT_TYPE}) => {
    const [name, setName] = useState(robotType?.name);
    const [nameHelper, setNameHelper] = useState(DEFAULT_NAME_HELPER);

    const [vendor, setVendor] = useState(robotType.vendor);
    const [vendorHelper, setVendorHelper] = useState(DEFAULT_VENDOR_HELPER);

    const [capacity, setCapacity] = useState(robotType.capacity);
    const [capacityHelper, setCapacityHelper] = useState(DEFAULT_CAPACITY_HELPER);

    const [range, setRange] = useState(robotType.range);
    const [rangeHelper, setRangeHelper] = useState(DEFAULT_RANGE_HELPER);

    const onValidatedSubmit = () => {
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
        if (isNaN(Number(capacity))) {
            setCapacityHelper("Capacity must be a floating point number");
            validated = false;
        } else {
            setCapacityHelper(DEFAULT_CAPACITY_HELPER);
        }
        if (isNaN(Number(range))) {
            setRangeHelper("Range must be a floating point number");
            validated = false;
        } else {
            setRangeHelper(DEFAULT_RANGE_HELPER);
        }

        if (validated) {
            onSubmit({name, vendor, capacity, range});
        }
    };

    return (
        <List>
            <ListItem>
                <Container>
                    <TextField
                        variant="outlined"
                        error={DEFAULT_NAME_HELPER !== nameHelper}
                        helperText={nameHelper}
                        placeholder="Type name here ..."
                        fullWidth
                        value={name}
                        onChange={(evt) => setName(evt.target.value)}
                    />
                </Container>
            </ListItem>
            <ListItem>
                <Container>
                    <TextField
                        variant="outlined"
                        error={DEFAULT_VENDOR_HELPER !== vendorHelper}
                        helperText={vendorHelper}
                        placeholder="Type vendor here ..."
                        fullWidth
                        value={vendor}
                        onChange={(evt) => setVendor(evt.target.value)}
                    />
                </Container>
            </ListItem>
            <ListItem>
                <Container>
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
                </Container>
            </ListItem>
            <ListItem>
                <Container>
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
                </Container>
            </ListItem>
            <ListItem>
                <Container>
                    <Button variant="outlined" onClick={onValidatedSubmit}>
                        {submissionText}
                    </Button>
                </Container>
            </ListItem>
        </List>
    );
};

export default RobotPropertyEditor;