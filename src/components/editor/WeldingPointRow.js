import styled from "styled-components";
import {ReactComponent as IconDrag} from "../../icons/IconDrag.svg";
import {SortableKnob, SortableItem} from "react-easy-sort";


const PointRow = styled.div`
  padding: 8px;
  margin-top: 6px;
  background-color: #E5E5E5;
  border-radius: 8px;
  
  > :not(:first-child) {
    border-right: 2px solid #8E8E8E;
  }
`;

const StyledIconDrag = styled(IconDrag)`
  width: 14px;
  height: 14px;
`;

const CellName = styled.input`
  display: inline-block;
  width: calc(100% * 3 / 11 - 16px);
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

const CellKnob = styled.div`
  display: inline-block;
  vertical-align: middle;
  width: 16px;
  cursor: grab;
`;
const RobotTypeCellValue = styled.select`
  display: inline-block;
  vertical-align: middle;
  width: calc(100% * 1 / 11 - 16px);
  background: none;
  border: none;
`;

const WeldingPointRow = ({weldingPoint, updateValue, robots}) => {
    return (
        <SortableItem>
            <PointRow>
                <SortableKnob>
                    <CellKnob>
                        <StyledIconDrag/>
                    </CellKnob>
                </SortableKnob>

                <CellName
                    value={weldingPoint.name}
                    onChange={(evt) => updateValue("name", evt.target.value)}
                />

                {["x", "y", "z", "roll", "pitch", "yaw", "tolerance"].map((field) => (
                    <CellValue
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
            </PointRow>
        </SortableItem>
    );
};

export default WeldingPointRow;
