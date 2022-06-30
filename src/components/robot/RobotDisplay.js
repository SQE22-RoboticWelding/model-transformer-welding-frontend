import {List, ListItem, Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import RobotDeletor from "./RobotDeletor";
import RobotEditor from "./RobotEditor";

const RobotDisplay = ({robots, onRobotUpdated, projects}) => {
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
                                <TableCell width={1}/>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>{robot.id}</TableCell>
                                <TableCell>{robot.description}</TableCell>
                                <TableCell width={1}>
                                    <RobotEditor robot={robot} onRobotUpdated={onRobotUpdated} projects={projects}/>
                                </TableCell>
                                <TableCell width={1}>
                                    <RobotDeletor robot={robot} onRobotDeleted={onRobotUpdated}/>
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
