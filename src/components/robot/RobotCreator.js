import {Button, Container, Dialog, DialogTitle, InputAdornment, List, ListItem, TextField} from "@mui/material";
import {useState} from "react";
import FetchHandler from "../common/FetchHandler";
import Settings from "../common/settings";
import Notifications from "../common/Notifications";


const DEFAULT_NAME_HELPER = "Name";
const DEFAULT_VENDOR_HELPER = "Vendor";
const DEFAULT_CAPACITY_HELPER = "Capacity in kilograms";
const DEFAULT_RANGE_HELPER = "Range in meters";


const uploadRobotType = (name, vendor, capacity, range) => {
    const requestBody = {
        name, vendor,
        ...(capacity && {capacity}),
        ...(range && {range})
    };
    const fetchProps = {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {"Content-Type": "application/json"}
    };
    return new Promise((resolve, reject) => {
        FetchHandler.simple(fetch(Settings.robotTypePath, fetchProps))
            .then(() => Notifications.notify("Created Robot Type", "success"))
            .catch((err) => {
                Notifications.notify(`Unable to create robot type\n${err}`, "error");
                reject();
            });
    });
};

const RobotCreator = ({onRequestRobotTypeRefresh}) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    const [name, setName] = useState("");
    const [nameHelper, setNameHelper] = useState(DEFAULT_NAME_HELPER);

    const [vendor, setVendor] = useState("");
    const [vendorHelper, setVendorHelper] = useState(DEFAULT_VENDOR_HELPER);

    const [capacity, setCapacity] = useState("");
    const [capacityHelper, setCapacityHelper] = useState(DEFAULT_CAPACITY_HELPER);

    const [range, setRange] = useState("");
    const [rangeHelper, setRangeHelper] = useState(DEFAULT_RANGE_HELPER);

    const onSubmit = () => {
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
            uploadRobotType(name, vendor, capacity, range)
                .then(() => {
                    setDialogOpen(false);
                    onRequestRobotTypeRefresh();
                });
        }
    };

    return (
        <>
            <Button variant="contained" onClick={() => setDialogOpen(true)}>
                Create a new Robot Type
            </Button>

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Create a Robot Type</DialogTitle>
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
                            <Button variant="outlined" onClick={onSubmit}>
                                Create
                            </Button>
                        </Container>
                    </ListItem>
                </List>
            </Dialog>
        </>
    );
};

export default RobotCreator;