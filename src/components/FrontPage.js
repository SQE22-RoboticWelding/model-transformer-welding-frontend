import NavBar from "./NavBar";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import ProjectPage from "./project/ProjectPage";
import RobotTypePage from "./robot/RobotTypePage";
import TemplatePage from "./template/TemplatePage";
import ProjectDetailDialog from "./project/ProjectDetailDialog";
import FileUpload from "./project/upload/FileUpload";
import {Grid} from "@mui/material";


const FrontPage = () => (
    <Grid
        container
        display="grid"
        gridTemplateColumns="141px 1fr"
        padding="10px"
        minWidth="800px"
        width="100%"
        height="100vh"
    >
        <BrowserRouter>
            <NavBar/>
            <Routes>
                <Route path="/create" element={<FileUpload/>}/>
                <Route path="/project" element={<ProjectPage/>}>
                    <Route path=":id" element={<ProjectDetailDialog/>}/>
                </Route>
                <Route path="/robot" element={<RobotTypePage/>}/>
                <Route path="/template" element={<TemplatePage/>}/>
            </Routes>
        </BrowserRouter>
    </Grid>
);

export default FrontPage;
