import styled from "styled-components";
import FrontPage from "./components/FrontPage";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const AppRoot = styled.div`
  display: flex;
  align-items: center;
  min-height: 100vh;
`;

const App = () => {

    return (
        <AppRoot>
            <FrontPage/>
            <ToastContainer limit={3}/>
        </AppRoot>
    );
};

export default App;
