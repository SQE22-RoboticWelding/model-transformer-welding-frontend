import styled from "styled-components";
import {useEffect, useState} from "react";
import FetchHandler from "../common/FetchHandler";
import Settings from "../common/settings";
import Notifications from "../common/Notifications";

const GeneratorPageRoot = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  > * {
    margin-bottom: 16px;
  }
`;

const TableRoot = styled.table`
  width: 100%;
  border-collapse: collapse;
  box-shadow: 0 0 8px 0 #8E8E8E;
  border-radius: 8px;
`;
const TableHeader = styled.thead`
  width: 100%;
`;

const TableRow = styled.tr`
  > * {
    padding: 2em;

    :nth-child(odd) {
      background-color: #EFEFEF;
    }

    :nth-child(even) {
      background-color: #DFDFDF;
    }
  }
`;

const BodyTableRow = styled(TableRow)`
  > * {
    border-top: 1px solid black;
  }
`;

const CellHeader = styled.th`
  border-bottom: 2px solid black;
`;
const CellSingleHeader = styled(CellHeader)`
  width: calc(100% * 1 / 5);
`;
const CellDoubleHeader = styled(CellHeader)`
  width: calc(100% * 2 / 5);
`;

const CellSingle = styled.td`
  width: calc(100% * 1 / 5);
`;
const CellDouble = styled.td`
  width: calc(100% * 2 / 6);
`;

const GenerateButton = styled.td`
  cursor: pointer;
  width: 128px;

  :hover {
    background-color: #BFBFBF;
  }
`;

const GeneratorPage = () => {
    const [projectRetrievalState, setProjectRetrievalState] = useState("idle");
    const [availableProjects, setAvailableProjects] = useState([]);

    useEffect(() => {
        setProjectRetrievalState("loading");
        FetchHandler.readingJson(fetch(Settings.projectsPath, {method: "GET"}))
            .then((projects) => {
                setAvailableProjects(projects);
                setProjectRetrievalState("success");
            })
    }, []);

    return (
        <GeneratorPageRoot>
            {(projectRetrievalState === "success" && availableProjects.length > 0) ? (
                <TableRoot>
                    <TableHeader>
                        <TableRow>
                            <CellSingleHeader>Name</CellSingleHeader>
                            <CellDoubleHeader>Description</CellDoubleHeader>
                            <CellSingleHeader>Created</CellSingleHeader>
                            <CellSingleHeader>Last Modification</CellSingleHeader>
                            <CellHeader/>
                        </TableRow>
                    </TableHeader>

                    <tbody>
                    {availableProjects.map((project) => (
                        <BodyTableRow key={project.id}>
                            <CellSingle>{project.name}</CellSingle>
                            <CellDouble>{project.description}</CellDouble>
                            <CellSingle>{new Date(project.created_at).toLocaleString("de-DE")}</CellSingle>
                            <CellSingle>{new Date(project.modified_at).toLocaleString("de-DE")}</CellSingle>
                            <GenerateButton onClick={() => Notifications.notify("Not implemented yet", "warning")}>
                                Generate | Edit
                            </GenerateButton>
                        </BodyTableRow>
                    ))}
                    </tbody>
                </TableRoot>
            ) : projectRetrievalState === "success" ? (
                <p>There are no projects yet</p>
            ) : projectRetrievalState === "loading" &&
                <p>Loading...</p>
            }
        </GeneratorPageRoot>
    );
};

export default GeneratorPage;