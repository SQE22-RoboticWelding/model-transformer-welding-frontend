import {IconButton, List, ListItem, Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import {Add} from "@mui/icons-material";
import Notifications from "../common/Notifications";

const RobotDisplay = ({robots}) => {
    return (
        <List>
            {robots.map((robot) => (
                <ListItem>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell width={1}>
                                    <IconButton onClick={() => Notifications.notify("Not implement yet", "warning")}>
                                        <Add/>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>{robot.id}</TableCell>
                                <TableCell>{robot.description}</TableCell>
                                <TableCell width={1}/>
                            </TableRow>
                        </TableBody>
                    </Table>
                </ListItem>
            ))}
        </List>
    );
};

export default RobotDisplay;
