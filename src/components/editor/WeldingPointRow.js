import styled from "styled-components";
import {ReactComponent as IconDrag} from "../../icons/IconDrag.svg";
import {SortableKnob, SortableItem} from "react-easy-sort";
import { Button } from "@mui/material";


const PointRow = styled.div`
  z-index: 999999999999;
  padding: 8px;
  margin-top: 6px;
  background-color: #E5E5E5;
  border-radius: 8px;
  
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  > :not(:nth-child(1), :nth-child(2), :last-child) {
    border-left: 2px solid #8E8E8E;
  }
`;

const StyledIconDrag = styled(IconDrag)`
  width: 14px;
  height: 14px;
`;

const Cell = styled.input`
  display: inline-block;
  vertical-align: middle;
  width: calc(100% * 1 / 9 - 16px);
  border: none;
  background: none;

  :focus {
    outline: none;
    background-color: #F8F8F8;
  }
`;

const CellKnob = styled.div`
  display: inline-block;
  vertical-align: middle;
  width: 16px;
  cursor: grab;
`;
const RobotTypeCellValue = styled.select`
  display: inline-block;
  vertical-align: middle;
  width: calc(100% * 1 / 9 - 16px);
  background: none;
  border: none;
`;

const WeldingPointRow = ({weldingPoint, updateValue, robots, onDelete}) => {
    return (
        <SortableItem>
            <PointRow>
                <SortableKnob>
                    <CellKnob>
                        <StyledIconDrag/>
                    </CellKnob>
                </SortableKnob>

                <Cell
                    value={weldingPoint.name}
                    onChange={(evt) => updateValue("name", evt.target.value)}
                />

                {["x", "y", "z", "roll", "pitch", "yaw", "tolerance"].map((field) => (
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
                            [{robot.id}]: {robot.description}
                        </option>
                    ))}
                </RobotTypeCellValue>

                <Button
                  key={"Delete"}
                  style={{width: "84px"}}
                  onClick={() => {onDelete(weldingPoint.id)}}
                >
                    Delete
                </Button>
            </PointRow>
        </SortableItem>
    );
};

export default WeldingPointRow;
