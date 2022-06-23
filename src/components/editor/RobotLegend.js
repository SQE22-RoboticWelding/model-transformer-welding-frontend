import styled from "styled-components";
import FetchHandler from "../common/FetchHandler";
import Settings from "../common/settings";
import {useEffect} from "react";
import Notifications from "../common/Notifications";

const RobotLegendTable = styled.table`
  border-collapse: collapse;
`;

const HeadCell = styled.th`
  border: 1px solid black;
  padding: 1em;
`;

const BodyCell = styled.td`
  border: 1px solid black;
  padding: 1em;
`;

const getRobots = () => FetchHandler.simple(fetch(Settings.robotPath, {method: "GET"}));

const RobotLegend = ({robots, setRobots}) => {
    // TODO: use new endpoint which united robot and robot type data
    useEffect(() => {
        getRobots()
            .then((response) => response.json()
                .then(setRobots)
                .catch((err) => Notifications.notify(`Failed to show robot types\n${err}`)))
            .catch((err) => Notifications.notify(`Failed to retrieve robot types\n${err}`, "error"))
    }, []);

    return (
        <RobotLegendTable>
            <thead>
            <tr>
                <HeadCell>Name</HeadCell>
                <HeadCell>Vendor</HeadCell>
                <HeadCell>Capacity load (in kg)</HeadCell>
                <HeadCell>Range (in m)</HeadCell>
            </tr>
            </thead>
            <tbody>
            {robots.map((robotType) => (
                <tr key={robotType.id}>
                    <BodyCell>{robotType.name}</BodyCell>
                    <BodyCell>{robotType.vendor}</BodyCell>
                    <BodyCell>{robotType.capacity_load_kg}</BodyCell>
                    <BodyCell>{robotType.range_m}</BodyCell>
                </tr>
            ))}
            </tbody>
        </RobotLegendTable>
    );
};

export default RobotLegend;