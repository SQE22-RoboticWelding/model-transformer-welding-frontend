import SortableList from "react-easy-sort";
import {useEffect, useState} from "react";
import Settings from "../common/settings";
import styled from "styled-components";
import WeldingPointRow from "./WeldingPointRow";
import FetchHandler from "../common/FetchHandler";
import Notifications from "../common/Notifications";


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

    useEffect(() => retrieveWeldingPoints(project.id, setWeldingPoints, setPointRetrievalState), [project.id]);
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
                        <SortableList onSortEnd={onSortEnd}>
                            {weldingPoints
                                .sort((a, b) => a.welding_order > b.welding_order)
                                .map((weldingPoint) => (
                                    <WeldingPointRow
                                        key={weldingPoint.id}
                                        weldingPoint={weldingPoint}
                                        updateValue={(field, value) => updateValue(weldingPoint, field, value)}
                                        robots={robots}
                                    />
                                ))}
                        </SortableList>
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
