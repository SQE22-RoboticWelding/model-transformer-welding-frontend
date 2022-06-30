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
                                <TableCell rowSpan={2}>ID</TableCell>
                                <TableCell rowSpan={2}>Name</TableCell>
                                <TableCell rowSpan={2}>Description</TableCell>
                                <TableCell rowSpan={2}>Project</TableCell>

                                <TableCell colSpan={3}>Position</TableCell>
                                <TableCell colSpan={3}>Normal Vector</TableCell>

                                <TableCell width={1}/>
                                <TableCell width={1}/>
                            </TableRow>
                            <TableRow>
                                <TableCell>x</TableCell>
                                <TableCell>y</TableCell>
                                <TableCell>z</TableCell>

                                <TableCell>x</TableCell>
                                <TableCell>y</TableCell>
                                <TableCell>z</TableCell>

                                <TableCell width={1}/>
                                <TableCell width={1}/>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>{robot.id}</TableCell>
                                <TableCell>{robot.name}</TableCell>
                                <TableCell>{robot.description}</TableCell>
                                <TableCell>
                                    {
                                        projects?.filter((project) => project.id === robot.project_id)[0].name
                                    }
                                </TableCell>

                                <TableCell>{robot.position_x}</TableCell>
                                <TableCell>{robot.position_y}</TableCell>
                                <TableCell>{robot.position_z}</TableCell>

                                <TableCell>{robot.position_norm_vector_x}</TableCell>
                                <TableCell>{robot.position_norm_vector_y}</TableCell>
                                <TableCell>{robot.position_norm_vector_z}</TableCell>

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
