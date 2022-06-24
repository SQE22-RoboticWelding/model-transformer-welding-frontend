import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Typography
} from "@mui/material";
import styled from "styled-components";
import {useEffect, useState} from "react";
import FetchHandler from "../common/FetchHandler";
import Settings from "../common/settings";
import Notifications from "../common/Notifications";
import {CustomHr, TypographyTextCentered} from "../common/StyledComponents";
import RobotCreator from "./RobotCreator";
import RobotTypeEditor from "./RobotTypeEditor";
import RobotDisplay from "./RobotDisplay";


const AccordionHeader = styled(Typography)`
  width: 50%;
  min-width: min-content;
  display: flex;
  align-items: center;
  
  > :first-child {
    margin-right: 4px;
  }
`;

const RobotTypeAccordion = styled(Accordion)`
  width: 100%;
`;

const StyledTableCell = (props) => <TableCell {...props} sx={{borderBottom: "none"}} />

const hasCapacity = (robotType) => !isNaN(robotType.capacity_load_kg) && robotType.capacity_load_kg !== null;
const hasRange = (robotType) => !isNaN(robotType.range_m) && robotType.range_m !== null;

const RobotTypePage = () => {
    const [robotTypeRetrievalState, setRobotTypeRetrievalState] = useState("idle");
    const [robotTypes, setRobotTypes] = useState([]);
    const [openedRobotTypeId, setOpenedRobotTypeId] = useState(undefined);

    const [robotRetrievalState, setRobotRetrievalState] = useState("idle");
    const [robots, setRobots] = useState([]);

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
            .finally(() => setRobotTypeRetrievalState("idle"));
    };

    const toggleAccordion = (robotTypeId) => {
        if (openedRobotTypeId === robotTypeId) {
            setOpenedRobotTypeId(undefined);
        } else {
            setOpenedRobotTypeId(robotTypeId)
        }
    };

    const refreshAll = () => {
        retrieveRobotTypes();
        retrieveRobots();
    };

    useEffect(() => {
        refreshAll();
    }, []);

    return (
        <Grid container direction="column" alignItems="center" rowGap="24px">
            <RobotCreator onRequestRobotTypeRefresh={refreshAll}/>

            {(robotTypeRetrievalState === "idle" && robotTypes.length > 0) ? (
                robotTypes.map((robotType) => (
                    <RobotTypeAccordion
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

                            <RobotTypeEditor onRequestRobotTypeRefresh={refreshAll} robotType={robotType}/>
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
                                </TableBody>
                            </Table>

                            {hasCapacity(robotType) && hasRange(robotType) &&
                                <CustomHr height="3px" />
                            }

                            <RobotDisplay robots={robots.filter((robot) => robot.robot_type.id === robotType.id)}/>
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
