import {Accordion, AccordionDetails, AccordionSummary, Grid, Typography} from "@mui/material";
import styled from "styled-components";
import {useEffect, useState} from "react";
import FetchHandler from "../common/FetchHandler";
import Settings from "../common/settings";
import Notifications from "../common/Notifications";
import {TypographyTextCentered} from "../common/StyledComponents";
import RobotCreator from "./RobotCreator";
import RobotTypeEditor from "./RobotTypeEditor";


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

const RobotPage = () => {
    const [robotTypeRetrievalState, setRobotTypeRetrievalState] = useState("idle");
    const [robotTypes, setRobotTypes] = useState([]);

    const retrieveRobotTypes = () => {
        setRobotTypeRetrievalState("loading");
        FetchHandler.readingJson(fetch(Settings.robotTypePath, {method: "GET"}))
            .then((content) => {
                setRobotTypeRetrievalState("idle");
                setRobotTypes(content);
            })
            .catch((err) => {
                Notifications.notify(`Failed to retrieve Robot Types.\n${err}`, "error")
                setRobotTypeRetrievalState("idle");
            })
    };

    useEffect(() => retrieveRobotTypes(), []);

    return (
        <Grid container direction="column" alignItems="center" rowGap="24px">
            <RobotCreator onRequestRobotTypeRefresh={retrieveRobotTypes}/>

            {(robotTypeRetrievalState === "idle" && robotTypes.length > 0) ? (
                robotTypes.map((robotType) => (
                    <RobotTypeAccordion>
                        <AccordionSummary>
                            <AccordionHeader>
                                <b>Vendor:</b>
                                {robotType.vendor}
                            </AccordionHeader>

                            <AccordionHeader>
                                <b>Name:</b>
                                {robotType.name}
                            </AccordionHeader>

                            <RobotTypeEditor onRequestRobotTypeRefresh={retrieveRobotTypes} robotType={robotType}/>
                        </AccordionSummary>
                        <AccordionDetails>
                            I am detailed!
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

export default RobotPage;