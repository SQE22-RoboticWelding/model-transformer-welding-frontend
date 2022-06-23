import {useEffect, useState} from "react";
import Settings from "../common/settings";
import {Confirmation} from "../common/StyledComponents";
import styled from "styled-components";
import FetchHandler from "../common/FetchHandler";
import Notifications from "../common/Notifications";


const ProjectChooserRoot = styled(Confirmation)`
  flex-direction: column;
  
  > :first-child {
    margin-bottom: 16px;
  }
`;

const ProjectChooser = ({projects, setProjects, selectedProject, setSelectedProject}) => {
    const [projectRetrievalState, setProjectRetrievalState] = useState("idle");

    const onSelect = (evt) => {
        const [project] = projects.filter((project) => project.id === Number(evt.target.value));
        setSelectedProject(project);
    };

    useEffect(() => {
        FetchHandler.readingJson(fetch(Settings.projectsPath, {method: "GET"}))
            .then((projects) => {
                setProjects(projects);
                setProjectRetrievalState("success");
            })
            .catch((err) => {
                Notifications.notify(`Failed to retrieve projects\n${err}`, "error");
                setProjectRetrievalState("failed");
            });
    }, []);

    return (
        <ProjectChooserRoot>
            {(projectRetrievalState === "success" && projects.length > 0) ? (
                <>
                    <label>Choose a project</label>
                    <select onChange={onSelect} value={selectedProject?.id}>
                        {projects.map((project, idx) => (
                            <option key={idx} value={project.id}>
                                [{project.id}] {project.name}
                            </option>
                        ))}
                    </select>
                </>
            ) : projectRetrievalState === "success" ? (
                <p>There are no projects yet</p>
            ) : projectRetrievalState === "failed" ? (
                <p>
                    Failed to retrieve projects.
                </p>
            ) : projectRetrievalState === "idle" &&
                <p>Loading...</p>
            }
        </ProjectChooserRoot>
    );
};

export default ProjectChooser;