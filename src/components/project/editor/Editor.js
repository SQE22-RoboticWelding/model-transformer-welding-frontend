import SortableList from "react-easy-sort";
import {useEffect, useState} from "react";
import Settings from "../../common/settings";
import WeldingPointRow from "./WeldingPointRow";
import FetchHandler from "../../common/FetchHandler";
import Notifications from "../../common/Notifications";
import {Container, IconButton, styled} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";


const PointRow = styled("div")({
    padding: "8px 8px 8px 26px",
    marginTop: "6px",
    backgroundColor: "#E5E5E5",
    borderRadius: "8px",

    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",

    "> :not(:nth-child(1), :last-child)": {
        borderLeft: "2px solid #8E8E8E"
    }
});

const ValueInput = styled("input")({
    display: "inline-block",
    verticalAlign: "middle",
    width: "100%",
    padding: "0",
    border: "none",
    background: "none",

    ":focus": {
        outline: "none",
        backgroundColor: "#F8F8F8"
    }
});

const StyledCell = styled(Container)({
    padding: "0",
    display: "inline",
    width: "calc(100% * 1 / 9 - 16px)",
    margin: "0"
});

const Cell = (props) => <StyledCell><ValueInput {...props}/></StyledCell>;

const RobotTypeCellValue = styled("select")({
    display: "inline-block",
    verticalAlign: "middle",
    width: "calc(100 % * 1 / 9 - 16px)",
    background: "none",
    border: "none"
});

const PointTable = styled("div")({
    userSelect: "none"
});

const HeaderRow = styled("div")({
    display: "flex",
    justifyContent: "space-between",
    margin: "0 8px 0 24px"
});

const HeaderCell = styled("div")({
    display: "inline-block",
    textAlign: "center",
    verticalAlign: "middle",
    width: "calc(100% * 1 / 9 - 16px)",
    border: "none",
    background: "none"
});

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

const retrieveWeldingPoints = (projectId) => {
    return new Promise((resolve, reject) => {
        FetchHandler.readingJson(fetch(`${Settings.weldingPointsPath}/${projectId}`, {method: "GET"}))
            .then(resolve)
            .catch((err) => {
                Notifications.notify(`Failed to retrieve welding points\n${err}`, "error");
                reject();
            });
    });
};

const createWeldingPoint = (weldingPoint) => new Promise((resolve, reject) => {
    const requestProps = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(weldingPoint)
    };

    FetchHandler.readingJson(fetch(`${Settings.weldingPointsPath}`, requestProps))
        .then(resolve)
        .catch((err) => {
            Notifications.notify(`Failed to create welding point\n${err}`, "error");
            reject();
        });
});

const EMPTY_WELDING_POINT = {
    "robot_id": "",
    "welding_order": "",
    "name": "",
    "description": "",
    "x_original": "",
    "y_original": "",
    "z_original": "",
    "x": "",
    "y": "",
    "z": "",
    "roll": "",
    "pitch": "",
    "yaw": "",
    "tolerance": ""
};

const Editor = ({project, weldingPoints, setWeldingPoints, robots, validWeldingPoints}) => {
    const [pointRetrievalState, setPointRetrievalState] = useState("idle");
    const [newWeldingPoint, setNewWeldingPoint] = useState({...EMPTY_WELDING_POINT, project_id: project.id});

    const mergeToNewWeldingPoint = (additions) => setNewWeldingPoint({
        ...newWeldingPoint, ...additions
    });

    useEffect(() => {
        setPointRetrievalState("loading");
        retrieveWeldingPoints(project.id)
            .then(setWeldingPoints)
            .finally(() => setPointRetrievalState("idle"));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [project.id]);

    const onSortEnd = (oldIndex, newIndex) => setWeldingPoints(arrayMove(oldIndex, newIndex, weldingPoints));

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
            .then(() => setWeldingPoints(weldingPoints.filter(weldingPoint => weldingPoint.id !== id)))
            .catch((err) => Notifications.notify(`Failed to delete welding point\n${err}`, "error"));
    };

    const onAdd = () => {
        createWeldingPoint({...newWeldingPoint, welding_order: weldingPoints.at(-1)["welding_order"] + 1})
            .then((createdWeldingPoint) => setWeldingPoints([...weldingPoints, createdWeldingPoint]));
    };

    const onReset = (weldingPoint) => {
        const idx = weldingPoints.indexOf(weldingPoint);
        setWeldingPoints([
            ...weldingPoints.slice(0, idx),
            {
                ...weldingPoint, x: weldingPoint.x_original === "" ? null : weldingPoint.x_original,
                y: weldingPoint.y_original === "" ? null : weldingPoint.y_original,
                z: weldingPoint.z_original === "" ? null : weldingPoint.z_original
            },
            ...weldingPoints.slice(idx + 1)
        ]);
    };

    return (
        <div>
            {pointRetrievalState === "idle" ? (
                weldingPoints.length > 0 ? (
                    <PointTable>
                        <HeaderRow>
                            <HeaderCell>Name</HeaderCell>
                            <HeaderCell>X</HeaderCell>
                            <HeaderCell>Y</HeaderCell>
                            <HeaderCell>Z</HeaderCell>
                            <HeaderCell>Roll</HeaderCell>
                            <HeaderCell>Pitch</HeaderCell>
                            <HeaderCell>Yaw</HeaderCell>
                            <HeaderCell>Tolerance</HeaderCell>
                            <HeaderCell>Robot</HeaderCell>
                            <HeaderCell>Actions</HeaderCell>
                        </HeaderRow>
                        <SortableList onSortEnd={onSortEnd}>
                            {weldingPoints
                                .sort((a, b) => a.welding_order > b.welding_order)
                                .map((wp) => (
                                    <WeldingPointRow
                                        key={wp.id}
                                        weldingPoint={wp}
                                        isValid={!!validWeldingPoints.find((validWp) => wp.id === validWp.id)}
                                        updateValue={(field, value) => updateValue(wp, field, value)}
                                        robots={robots}
                                        onDelete={onDelete}
                                        onReset={onReset}
                                    />
                                ))}
                        </SortableList>
                        <PointRow>
                            <Cell
                                value={newWeldingPoint.name}
                                placeholder="Name"
                                onChange={(evt) => mergeToNewWeldingPoint({name: evt.target.value})}
                            />
                            <Cell
                                value={newWeldingPoint.x_original}
                                placeholder="X"
                                onChange={(evt) => mergeToNewWeldingPoint({
                                    x: evt.target.value,
                                    x_original: evt.target.value
                                })}
                            />
                            <Cell
                                value={newWeldingPoint.y_original}
                                placeholder="Y"
                                onChange={(evt) => mergeToNewWeldingPoint({
                                    y: evt.target.value,
                                    y_original: evt.target.value
                                })}
                            />
                            <Cell
                                value={newWeldingPoint.z_original}
                                placeholder="Z"
                                onChange={(evt) => mergeToNewWeldingPoint({
                                    z: evt.target.value,
                                    z_original: evt.target.value
                                })}
                            />
                            <Cell
                                value={newWeldingPoint.roll}
                                placeholder="Roll"
                                onChange={(evt) => mergeToNewWeldingPoint({roll: evt.target.value})}
                            />
                            <Cell
                                value={newWeldingPoint.pitch}
                                placeholder="Pitch"
                                onChange={(evt) => mergeToNewWeldingPoint({pitch: evt.target.value})}
                            />
                            <Cell
                                value={newWeldingPoint.yaw}
                                placeholder="Yaw"
                                onChange={(evt) => mergeToNewWeldingPoint({yaw: evt.target.value})}
                            />
                            <Cell
                                value={newWeldingPoint.tolerance}
                                placeholder="Tolerance"
                                onChange={(evt) => mergeToNewWeldingPoint({tolerance: evt.target.value})}
                            />
                            <RobotTypeCellValue
                                value={newWeldingPoint.robot_id}
                                onChange={(evt) => mergeToNewWeldingPoint({robot_id: evt.target.value})}
                            >
                                <option value=""/>
                                {robots.map((robot) => (
                                    <option
                                        key={robot.id}
                                        value={robot.id}
                                    >
                                        [{robot.id}]: {robot.name}
                                    </option>
                                ))}
                            </RobotTypeCellValue>
                            <IconButton onClick={onAdd}>
                                <AddIcon color="success"/>
                            </IconButton>
                        </PointRow>
                    </PointTable>
                ) : (
                    <p>No welding points to show.</p>
                )
            ) : pointRetrievalState === "loading" &&
                <p>Loading...</p>
            }
        </div>
    );
};

export default Editor;
