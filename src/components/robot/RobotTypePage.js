import {
    Accordion,
    AccordionDetails,
    AccordionSummary, Divider,
    Grid, styled,
    Table,
    TableBody,
    TableCell,
    TableRow, TextField,
    Typography
} from "@mui/material";
import {useEffect, useState} from "react";
import FetchHandler from "../common/FetchHandler";
import Settings from "../common/settings";
import Notifications from "../common/Notifications";
import {CustomHr, TypographyTextCentered} from "../common/StyledComponents";
import RobotTypeCreator from "./RobotTypeCreator";
import RobotTypeEditor from "./RobotTypeEditor";
import RobotDisplay from "./RobotDisplay";
import RobotCreator from "./RobotCreator";
import RobotTypeDeletor from "./RobotTypeDeletor";


const AccordionHeader = styled(Typography)({
    width: "50%",
    minWidth: "min-content",
    display: "flex",
    alignItems: "center",

    "> :first-child": {
        marginRight: "4px"
    }
});

const RobotTypeAccordion = styled(Accordion)({
    width: "100%"
})

const StyledTableCell = (props) => <TableCell {...props} sx={{borderBottom: "none"}}/>

const hasCapacity = (robotType) => !isNaN(robotType.capacity_load_kg) && robotType.capacity_load_kg !== null;
const hasRange = (robotType) => !isNaN(robotType.range_m) && robotType.range_m !== null;
const hasGenerationTemplate = (robotType) => !isNaN(robotType.generation_template_id) && robotType.generation_template_id !== null;

const robotHasMatchingProjectName = (robot, projects, projectNameMatch) => {
    if (projectNameMatch && projects) {
        return projects
            .find((project) => robot.project_id === project.id)
            .name.toLowerCase()
            .includes(projectNameMatch.toLowerCase());
    } else {
        return true;  // match all
    }
};

const RobotTypePage = () => {
    const [projectNameFilter, setProjectNameFilter] = useState("");
    const [projects, setProjects] = useState(undefined);
    const [robotTypeRetrievalState, setRobotTypeRetrievalState] = useState("idle");
    const [robotTypes, setRobotTypes] = useState([]);
    const [openedRobotTypeId, setOpenedRobotTypeId] = useState(undefined);


    const [robotRetrievalState, setRobotRetrievalState] = useState("idle");
    const [robots, setRobots] = useState([]);

    const matchRobot = (robot) => robotHasMatchingProjectName(robot, projects, projectNameFilter);
    const matchRobotType = (robotType) => !projectNameFilter  // show all robot types if filter is empty
        || robots
            .filter((robot) => robotType.id === robot.robot_type_id)
            .filter(matchRobot)
            .length > 0;

    const retrieveProjects = () => {
        FetchHandler.readingJson(fetch(Settings.projectsPath, {method: "GET"}))
            .then(setProjects)
            .catch((err) => Notifications.notify(`Failed to retrieve Projects.\n${err}`, "error"));
    };

    const retrieveRobotTypes = () => {
        setRobotTypeRetrievalState("loading");
        FetchHandler.readingJson(fetch(Settings.robotTypePath, {method: "GET"}))
            .then(setRobotTypes)
            .catch((err) => Notifications.notify(`Failed to retrieve Robot Types.\n${err}`, "error"))
            .finally(() => setRobotTypeRetrievalState("idle"));
    };

    const retrieveRobots = () => {
        setRobotRetrievalState("loading");
        FetchHandler.readingJson(fetch(Settings.robotPath, {method: "GET"}))
            .then(setRobots)
            .catch((err) => Notifications.notify(`Failed to retrieve Robots.\n${err}`, "error"))
            .finally(() => setRobotRetrievalState("idle"));
    };

    const refreshAll = () => {
        retrieveRobotTypes();
        retrieveRobots();
        retrieveProjects();
    };

    const onRobotCreated = (robotType) => {
        retrieveRobots();
        setOpenedRobotTypeId(robotType.id);
    };

    const toggleAccordion = (robotTypeId) => {
        if (openedRobotTypeId === robotTypeId) {
            setOpenedRobotTypeId(undefined);
        } else {
            setOpenedRobotTypeId(robotTypeId)
        }
    };

    useEffect(() => {
        refreshAll();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Grid container direction="column" alignItems="center" rowGap="24px">
            <RobotTypeCreator onRequestRobotTypeRefresh={refreshAll}/>

            <TextField
                value={projectNameFilter}
                onChange={(evt) => setProjectNameFilter(evt.target.value)}
                style={{alignSelf: "start"}}
                fullWidth
                helperText="Filter project by name"
                placeholder="Type here ..."
            />

            {(robotTypeRetrievalState === "idle" && robotTypes.length > 0) ? (
                robotTypes
                    .filter(matchRobotType)
                    .map((robotType) => (
                        <RobotTypeAccordion
                            key={robotType.id}
                            expanded={openedRobotTypeId === robotType.id}
                            onChange={() => toggleAccordion(robotType.id)}
                        >
                            <AccordionSummary>
                                <AccordionHeader>
                                    <b>Vendor:</b>
                                    {robotType.vendor}
                                </AccordionHeader>

                                <AccordionHeader>
                                    <b>Name:</b>
                                    {robotType.name}
                                </AccordionHeader>

                                <RobotCreator
                                    robotTypeId={robotType.id}
                                    onRobotCreated={() => onRobotCreated(robotType)}
                                    projects={projects}
                                />

                                <Divider orientation="vertical" flexItem={true} style={{margin: "6px"}}/>

                                <RobotTypeEditor onRequestRobotTypeRefresh={refreshAll} robotType={robotType}/>
                                <RobotTypeDeletor
                                    robotType={robotType}
                                    onRobotTypeDeleted={refreshAll}
                                    canDelete={robots.filter((robot) => robot.robot_type.id === robotType.id).length === 0}
                                />
                            </AccordionSummary>
                            <AccordionDetails>
                                <Table width="min-content">
                                    <TableBody>
                                        {hasCapacity(robotType) &&
                                            <TableRow>
                                                <StyledTableCell><b>Capacity:</b></StyledTableCell>
                                                <StyledTableCell>{robotType.capacity_load_kg} kg</StyledTableCell>
                                            </TableRow>
                                        }

                                        {hasRange(robotType) &&
                                            <TableRow>
                                                <StyledTableCell><b>Range:</b></StyledTableCell>
                                                <StyledTableCell>{robotType.range_m} m</StyledTableCell>
                                            </TableRow>
                                        }

                                        {hasGenerationTemplate(robotType) &&
                                            <TableRow>
                                                <StyledTableCell><b>Generation Template:</b></StyledTableCell>
                                                <StyledTableCell>{robotType.generation_template.name}</StyledTableCell>
                                            </TableRow>
                                        }
                                    </TableBody>
                                </Table>


                                {(hasCapacity(robotType) || hasRange(robotType) || hasGenerationTemplate(robotType)) &&
                                    <CustomHr height="3px"/>
                                }

                                {robotRetrievalState === "idle" ? (
                                    <RobotDisplay
                                        robots={robots
                                            .filter((robot) => robot.robot_type.id === robotType.id)
                                            .filter(matchRobot)}
                                        onRobotUpdated={retrieveRobots}
                                        projects={projects}
                                    />
                                ) : robotRetrievalState === "loading" && (
                                    <Typography>Loading...</Typography>
                                )}
                            </AccordionDetails>
                        </RobotTypeAccordion>
                    ))
            ) : robotTypeRetrievalState === "idle" ? (
                <TypographyTextCentered>There are no robot types yet!</TypographyTextCentered>
            ) : robotTypeRetrievalState === "loading" &&
                <TypographyTextCentered>Loading...</TypographyTextCentered>
            }
        </Grid>
    );
};

export default RobotTypePage;
