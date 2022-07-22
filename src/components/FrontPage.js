import NavBar from "./NavBar";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import FileUpload from "./upload/FileUpload";
import GeneratorPage from "./generator/GeneratorPage";
import RobotTypePage from "./robot/RobotTypePage";
import TemplatePage from "./template/TemplatePage";
import EditDialog from "./generator/EditDialog";
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
                <Route path="/view" element={<GeneratorPage/>}>
                    <Route path=":id" element={<EditDialog/>}/>
                </Route>
                <Route path="/robot" element={<RobotTypePage/>}/>
                <Route path="/template" element={<TemplatePage/>}/>
            </Routes>
        </BrowserRouter>
    </Grid>
);

export default FrontPage;
