import styled from "styled-components";
import NavBar from "./NavBar";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import ProjectPage from "./project/ProjectPage";
import RobotTypePage from "./robot/RobotTypePage";
import TemplatePage from "./template/TemplatePage";
import EditDialog from "./project/EditDialog";


const FrontPageRoot = styled.div`
  height: 100vh;
  width: 100%;
  min-width: 800px;
  display: grid;
  grid-template-columns: 142px 1fr;
  padding: 10px;
`;

const FrontPage = () => {

    return (
        <FrontPageRoot>
            <BrowserRouter>
                <NavBar/>
                <Routes>
                    <Route path="/project" element={<ProjectPage/>}>
                        <Route path=":id" element={<EditDialog/>}/>
                    </Route>
                    <Route path="/robot" element={<RobotTypePage/>}/>
                    <Route path="/template" element={<TemplatePage/>}/>
                </Routes>
            </BrowserRouter>
        </FrontPageRoot>
    );
};

export default FrontPage;
