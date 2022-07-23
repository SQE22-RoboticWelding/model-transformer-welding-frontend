import styled from "styled-components";
import NavBar from "./NavBar";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import FileUpload from "./upload/FileUpload";
import GeneratorPage from "./generator/GeneratorPage";
import RobotTypePage from "./robot/RobotTypePage";
import TemplatePage from "./template/TemplatePage";
import ProjectDetailDialog from "./generator/ProjectDetailDialog";


const FrontPageRoot = styled.div`
  height: 100vh;
  width: 100%;
  min-width: 800px;
  display: grid;
  grid-template-columns: 200px auto;
  padding: 10px;
`;

const FrontPage = () => {

    return (
        <FrontPageRoot>
            <BrowserRouter>
                <NavBar/>
                <Routes>
                    <Route path="/create" element={<FileUpload/>}/>
                    <Route path="/view" element={<GeneratorPage/>}>
                        <Route path=":id" element={<ProjectDetailDialog/>}/>
                    </Route>
                    <Route path="/robot" element={<RobotTypePage/>}/>
                    <Route path="/template" element={<TemplatePage/>}/>
                </Routes>
            </BrowserRouter>
        </FrontPageRoot>
    );
};

export default FrontPage;
