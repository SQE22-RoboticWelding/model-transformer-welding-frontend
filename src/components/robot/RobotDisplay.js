import {List, ListItem, ListItemText, Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import RobotDeletor from "./RobotDeletor";
import RobotEditor from "./RobotEditor";

const RobotDisplay = ({robots, onRobotUpdated, projects}) => {
    return (
        <List>
            {robots.length > 0 ? (
                <>
                    <ListItem>
                        <ListItemText><b>Robots:</b></ListItemText>
                    </ListItem>

                    <ListItem>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell rowSpan={2}>ID</TableCell>
                                    <TableCell rowSpan={2}>Name</TableCell>
                                    <TableCell rowSpan={2}>Description</TableCell>
                                    <TableCell rowSpan={2}>Project</TableCell>

                                    <TableCell colSpan={3}>Position</TableCell>

                                    <TableCell width={1}/>
                                    <TableCell width={1}/>
                                </TableRow>
                                <TableRow>
                                    <TableCell>x</TableCell>
                                    <TableCell>y</TableCell>
                                    <TableCell>z</TableCell>

                                    <TableCell width={1}/>
                                    <TableCell width={1}/>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {robots.map((robot) => (
                                    <TableRow key={robot.id}>
                                        <TableCell>{robot.id}</TableCell>
                                        <TableCell>{robot.name}</TableCell>
                                        <TableCell>{robot.description}</TableCell>
                                        {Boolean(projects) ? (
                                            <TableCell>
                                                {projects.filter((project) => project.id === robot.project_id)[0].name}
                                            </TableCell>
                                        ) : (
                                            <TableCell>
                                                Loading...
                                            </TableCell>
                                        )}

                                        <TableCell>{robot.position_x}</TableCell>
                                        <TableCell>{robot.position_y}</TableCell>
                                        <TableCell>{robot.position_z}</TableCell>

                                        <TableCell width={1}>
                                            <RobotEditor robot={robot} onRobotUpdated={onRobotUpdated}
                                                         projects={projects}/>
                                        </TableCell>
                                        <TableCell width={1}>
                                            <RobotDeletor robot={robot} onRobotDeleted={onRobotUpdated}/>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ListItem>
                </>
            ) : (
                <ListItem>
                    <ListItemText><b>There are no robots yet.</b></ListItemText>
                </ListItem>
            )}
        </List>
    );
};

export default RobotDisplay;
