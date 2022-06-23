import styled from "styled-components";
import NavBar from "./NavBar";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import FileUpload from "./upload/FileUpload";
import EditorPage from "./editor/EditorPage";
import GeneratorPage from "./generator/GeneratorPage";
import RobotPage from "./robot/RobotPage";


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
                    <Route path="/edit" element={<EditorPage/>}/>
                    <Route path="/generate" element={<GeneratorPage/>}/>
                    <Route path="/robot" element={<RobotPage/>}/>
                </Routes>
            </BrowserRouter>
        </FrontPageRoot>
    );
};

export default FrontPage;
