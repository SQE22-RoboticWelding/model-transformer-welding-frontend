import {List, ListItem, Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import RobotDeletor from "./RobotDeletor";

const RobotDisplay = ({robots, onRobotDeleted}) => {
    return (
        <List>
            {robots.map((robot) => (
                <ListItem key={robot.id}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell width={1}/>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>{robot.id}</TableCell>
                                <TableCell>{robot.description}</TableCell>
                                <TableCell width={1}>
                                    <RobotDeletor robot={robot} onRobotDeleted={onRobotDeleted}/>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </ListItem>
            ))}
        </List>
    );
};

export default RobotDisplay;
