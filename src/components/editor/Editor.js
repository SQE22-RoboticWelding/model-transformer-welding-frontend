import SortableList from "react-easy-sort";
import {useEffect, useState} from "react";
import Settings from "../common/settings";
import styled from "styled-components";
import WeldingPointRow from "./WeldingPointRow";
import FetchHandler from "../common/FetchHandler";
import Notifications from "../common/Notifications";
import { Button } from "@mui/material";


const PointRow = styled.div`
  z-index: 999999999999;
  padding: 8px;
  margin-top: 6px;
  background-color: #E5E5E5;
  border-radius: 8px;
  
  > :not(:first-child) {
    border-right: 2px solid #8E8E8E;
  }
`;

const CellName = styled.input`
  display: inline-block;
  width: calc(100% * 3 / 11 - 0px);
  border: none;
  background: none;

  :focus {
    outline: none;
    background-color: #F8F8F8;
  }
`;
const CellValue = styled.input`
  display: inline-block;
  vertical-align: middle;
  width: calc(100% * 1 / 11 - 16px);
  border: none;
  background: none;

  :focus {
    outline: none;
    background-color: #F8F8F8;
  }
`;

const RobotTypeCellValue = styled.select`
  display: inline-block;
  vertical-align: middle;
  width: calc(100% * 1 / 11 - 16px);
  background: none;
  border: none;
`;


const PointTable = styled.div`
  user-select: none;
`;

const CellNameHeader = styled.div`
  margin-left: 24px;
  display: inline-block;
  text-align: center;
  width: calc(100% * 3 / 11 - 16px);
`;

const CellValueHeader = styled.div`
  display: inline-block;
  text-align: center;
  vertical-align: middle;
  width: calc(100% * 1 / 11 - 16px);
  border: none;
  background: none;
`;

const arrayMove = (oldIndex, newIndex, array) => {
    if (oldIndex < newIndex) {
        return [
            ...array.slice(0, oldIndex),
            ...array.slice(oldIndex + 1, newIndex + 1),
            array[oldIndex],
            ...array.slice(newIndex + 1)
        ].map((point, idx) => ({...point, welding_order: idx}));
    } else if (oldIndex > newIndex) {
        return [
            ...array.slice(0, newIndex),
            array[oldIndex],
            ...array.slice(newIndex, oldIndex),
            ...array.slice(oldIndex + 1)
        ].map((point, idx) => ({...point, welding_order: idx}));
    }
};

const retrieveWeldingPoints = (projectId, onWeldingPoints, setState) => {
    FetchHandler.simple(fetch(`${Settings.weldingPointsPath}/${projectId}`, {method: "GET"}))
        .then((response) => response.json()
            .then((points) => {
                onWeldingPoints(points);
                setState("success");
            })
            .catch((err) => {
                setState("failed");
                Notifications.notify(`Failed to show welding points\n${err}`, "error");
            }))
        .catch((err) => {
            setState("failed");
            Notifications.notify(`Failed to retrieve welding points\n${err}`, "error");
        });
};

const Editor = ({project, weldingPoints, setWeldingPoints, robots}) => {
    const [pointRetrievalState, setPointRetrievalState] = useState("init");
    var addWeldingPoint = {
        "project_id": project.id,
        "robot_id": null,
        "welding_order": null,
        "name": "Name",
        "description": null,
        "x_original": null,
        "y_original": null,
        "z_original": null,
        "x": null,
        "y": null,
        "z": null,
        "roll": null,
        "pitch": null,
        "yaw": null,
        "tolerance": null
    };

    useEffect(() => retrieveWeldingPoints(project.id, setWeldingPoints, setPointRetrievalState), [project.id, setWeldingPoints]);
    useEffect(() => {
    }, []);

    const onSortEnd = (oldIndex, newIndex) => {
        setWeldingPoints(arrayMove(oldIndex, newIndex, weldingPoints))
    };
    
    const updateValue = (weldingPoint, field, value) => {
        const idx = weldingPoints.indexOf(weldingPoint);
        setWeldingPoints([
            ...weldingPoints.slice(0, idx),
            {...weldingPoint, [field]: value === "" ? null : value},
            ...weldingPoints.slice(idx + 1)
        ]);
    };

    const onDelete = (id) => {
        FetchHandler.simple(fetch(Settings.weldingPointsPath + "/" + id, {method: "DELETE"}))
                .then(() => {
                    setWeldingPoints(weldingPoints.filter(weldingPoint => weldingPoint.id !== id));
                })
                .catch((err) => {
                    Notifications.notify(`Failed to retrieve data\n${err}`, "error");
                });
    };

    const onAdd = () => {
        setWeldingPoints(weldingPoints => [...weldingPoints, addWeldingPoint]);

        return FetchHandler.simple(fetch(
            `${Settings.weldingPointsPath}`,
            {method: "PUT", body: JSON.stringify(weldingPoints), headers: {"Content-Type": "application/json"}}
        ))
        .then(() => {
        })
        .catch((err) => {
            Notifications.notify(`Failed to retrieve data\n${err}`, "error");
        });
    };

    return (
        <div>
            {pointRetrievalState === "success" ? (
                weldingPoints.length > 0 ? (
                    <PointTable>
                        <CellNameHeader>Name</CellNameHeader>
                        <CellValueHeader>X</CellValueHeader>
                        <CellValueHeader>Y</CellValueHeader>
                        <CellValueHeader>Z</CellValueHeader>
                        <CellValueHeader>Roll</CellValueHeader>
                        <CellValueHeader>Pitch</CellValueHeader>
                        <CellValueHeader>Yaw</CellValueHeader>
                        <CellValueHeader>Tolerance</CellValueHeader>
                        <CellValueHeader>Robot</CellValueHeader>
                        <CellValueHeader>Delete</CellValueHeader>
                        <SortableList onSortEnd={onSortEnd}>
                            {weldingPoints
                                .sort((a, b) => a.welding_order > b.welding_order)
                                .map((weldingPoint) => (
                                    <WeldingPointRow
                                        key={weldingPoint.id}
                                        weldingPoint={weldingPoint}
                                        updateValue={(field, value) => updateValue(weldingPoint, field, value)}
                                        robots={robots}
                                        onDelete={onDelete}
                                    />
                                ))}
                        </SortableList>
                        <PointRow>
                            <CellName
                                value={null}
                                placeholder="Name"
                                onChange={(evt) => {addWeldingPoint["name"] = evt.target.value}}
                            />
                            <CellValue
                                value={null}
                                placeholder="X"
                                onChange={(evt) => {addWeldingPoint["x"] = evt.target.value}}
                            />
                            <CellValue
                                value={null}
                                placeholder="Y"
                                onChange={(evt) => {addWeldingPoint["y"] = evt.target.value}}
                            />
                            <CellValue
                                value={null}
                                placeholder="Z"
                                onChange={(evt) => {addWeldingPoint["z"] = evt.target.value}}
                            />
                            <CellValue
                                value={null}
                                placeholder="Roll"
                                onChange={(evt) => {addWeldingPoint["roll"] = evt.target.value}}
                            />
                            <CellValue
                                value={null}
                                placeholder="Pitch"
                                onChange={(evt) => {addWeldingPoint["pitch"] = evt.target.value}}
                            />
                            <CellValue
                                value={null}
                                placeholder="Yaw"
                                onChange={(evt) => {addWeldingPoint["yaw"] = evt.target.value}}
                            />
                            <CellValue
                                value={null}
                                placeholder="Tolerance"
                                onChange={(evt) => {addWeldingPoint["tolerance"] = evt.target.value}}
                            />
                            <RobotTypeCellValue
                                value={null}
                                onChange={(evt) => {addWeldingPoint["robot_id"] = evt.target.value}}
                            >
                            <option value=""/>
                                {robots.map((robot) => (
                                    <option
                                        key={robot.id}
                                        value={robot.id}
                                    >
                                        [{robot.id}]: {robot.description}
                                    </option>
                                ))}
                            </RobotTypeCellValue>
                            <Button
                                onClick={() => {onAdd()}}
                            >
                                Add
                            </Button>
                        </PointRow>
                    </PointTable>
                ) : (
                    <p>Project has no welding points.</p>
                )
            ) : pointRetrievalState === "failed" ? (
                <p>Failed to retrieve welding points.</p>
            ) : pointRetrievalState === "init" &&
                <p>Loading...</p>
            }
        </div>
    );
};

export default Editor;
