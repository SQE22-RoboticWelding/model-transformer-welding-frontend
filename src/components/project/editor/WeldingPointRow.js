import {SortableKnob, SortableItem} from "react-easy-sort";
import {Button, styled} from "@mui/material";
import DragHandleIcon from '@mui/icons-material/DragHandle';


const PointRow = styled("div")({
    zIndex: "999999999999",
    padding: "8px",
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

const WELDING_POINT_PROPERTIES = ["x", "y", "z", "roll", "pitch", "yaw", "tolerance"];

const WeldingPointRow = ({weldingPoint, updateValue, robots, onDelete}) => {
    return (
        <SortableItem>
            <PointRow>
                <SortableKnob>
                    <CellKnob>
                        <DragHandleIcon transform="scale(0.8)"/>
                    </CellKnob>
                </SortableKnob>

                <Cell value={weldingPoint.name} onChange={(evt) => updateValue("name", evt.target.value)}/>

                {WELDING_POINT_PROPERTIES.map((field) => (
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
                            [{robot.id}]: {robot.name}
                        </option>
                    ))}
                </RobotTypeCellValue>

                <Button
                    key="Delete"
                    style={{width: "84px"}}
                    onClick={() => onDelete(weldingPoint.id)}
                >
                    Delete
                </Button>
            </PointRow>
        </SortableItem>
    );
};

export default WeldingPointRow;
