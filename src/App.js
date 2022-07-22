import FrontPage from "./components/FrontPage";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {Grid} from "@mui/material";

const App = () => (
    <Grid container display="flex" alignItems="center" minHeight="100vh">
        <FrontPage/>
        <ToastContainer limit={3}/>
    </Grid>
);

export default App;
