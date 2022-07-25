import {SortableKnob, SortableItem} from "react-easy-sort";
import {IconButton, styled, Tooltip, Typography} from "@mui/material";
import DragHandleIcon from '@mui/icons-material/DragHandle';
import DeleteIcon from "@mui/icons-material/Delete";
import UndoIcon from '@mui/icons-material/Undo';


const PointRow = styled("div")({
    zIndex: "999999999999",
    padding: "8px 8px 24px 8px",
    marginTop: "6px",
    backgroundColor: "#E5E5E5",
    borderRadius: "8px",

    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",

    "> :not(:nth-child(1), :nth-child(2), :last-child)": {
        borderLeft: "2px solid #8E8E8E"
    }
});

const CommonCellStyle = {
    display: "inline-block",
    verticalAlign: "middle",
    width: "calc(100% * 1 / 9 - 16px)",
    border: "none",
    background: "none"
};

const CoordinateCell = styled("div")({
    position: "relative"
});

const CoordinateLabel = styled(Typography)({
    position: "absolute",
    top: "100%"
});

const Cell = styled("input")({
    ...CommonCellStyle,
    ":focus": {
        outline: "none",
        backgroundColor: "#F8F8F8"
    }
});

const CellKnob = styled("div")({
    display: "flex",
    verticalAlign: "middle",
    cursor: "grab"
});

const RobotTypeCellValue = styled("select")(CommonCellStyle);

const COORDINATE_PROPERTIES = ["x", "y", "z"];
const OTHER_PROPERTIES = ["roll", "pitch", "yaw", "tolerance"];

const WeldingPointRow = ({weldingPoint, isValid, updateValue, robots, onDelete, onReset}) => {
    return (
        <SortableItem>
            <PointRow style={isValid ? undefined : {boxShadow: "0 0 4px 1px red"}}>
                <SortableKnob>
                    <CellKnob>
                        <DragHandleIcon transform="scale(0.8)"/>
                    </CellKnob>
                </SortableKnob>

                <Cell value={weldingPoint.name} onChange={(evt) => updateValue("name", evt.target.value)}/>

                {COORDINATE_PROPERTIES.map((field) => (
                    <CoordinateCell key={field}>
                        <Cell
                            value={weldingPoint[field] === null ? "" : weldingPoint[field]}
                            onChange={(evt) => updateValue(field, evt.target.value)}
                            style={{width: "100%"}}
                        />
                        <CoordinateLabel fontSize="xx-small">
                            Originally:<br/>
                            {weldingPoint[`${field}_original`]}
                        </CoordinateLabel>
                    </CoordinateCell>
                ))}


                {OTHER_PROPERTIES.map((field) => (
                    <Cell
                        key={field}
                        value={weldingPoint[field] === null ? "" : weldingPoint[field]}
                        onChange={(evt) => updateValue(field, evt.target.value)}
                    />
                ))}

                <RobotTypeCellValue
                    value={weldingPoint.robot_id === null ? "" : weldingPoint.robot_id}
                    onChange={(evt) => updateValue("robot_id", evt.target.value === "" ? null : evt.target.value)}
                >
                    <option value=""/>
                    {robots.map((robot) => (
                        <option
                            key={robot.id}
                            value={robot.id}
                        >
                            {robot.name}
                        </option>
                    ))}
                </RobotTypeCellValue>

                <Tooltip title="Reset X, Y, Z to original values">
                    <IconButton
                        key="Reset"
                        style={{border: "none"}}
                        onClick={() => onReset(weldingPoint)}
                    >
                        <UndoIcon color="warning" />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Delete welding point">
                <IconButton
                    key="Delete"
                    onClick={() => onDelete(weldingPoint)}
                >
                    <DeleteIcon color="error"/>
                </IconButton>
                </Tooltip>
            </PointRow>
        </SortableItem>
    );
};

export default WeldingPointRow;
