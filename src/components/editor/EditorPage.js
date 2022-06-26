import {useEffect, useState} from "react";
import Settings from "../common/settings";
import Editor from "./Editor";
import ProjectChooser from "./ProjectChooser";
import styled from "styled-components";
import Notifications from "../common/Notifications";
import FetchHandler from "../common/FetchHandler";
import RobotLegend from "./RobotLegend";


const TablePageRoot = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;

  > * {
    margin-bottom: 24px;
  }
`;

const synchronizeProject = (weldingPoints) => {
    return FetchHandler.simple(fetch(
        `${Settings.weldingPointsPath}`,
        {method: "PUT", body: JSON.stringify(weldingPoints), headers: {"Content-Type": "application/json"}}
    ));
};

const EditorPage = () => {
    const [availableProjects, setAvailableProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(undefined);
    const [weldingPoints, setWeldingPoints] = useState([]);
    const [robots, setRobots] = useState([]);

    const onUpdate = () => synchronizeProject(weldingPoints)
        .then(() => Notifications.notify("Synchronized project", "success"))
        .catch((err) => Notifications.notify(`Failed to synchronize project\n${err}`));

    useEffect(() => {
        if (!selectedProject && availableProjects.length > 0) {
            setSelectedProject(availableProjects[0]);
        }
    }, [availableProjects]);

    return (
        <TablePageRoot>
            <ProjectChooser
                projects={availableProjects}
                setProjects={setAvailableProjects}
                selectedProject={selectedProject}
                setSelectedProject={setSelectedProject}
            />

            {Boolean(selectedProject) &&
                <>
                    <Editor
                        project={selectedProject}
                        weldingPoints={weldingPoints}
                        setWeldingPoints={setWeldingPoints}
                        robots={robots}
                    />

                    <button onClick={onUpdate}>Update project!</button>

                    <RobotLegend robots={robots} setRobots={setRobots}/>
                </>
            }
        </TablePageRoot>
    );
};

export default EditorPage;
