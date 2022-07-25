import {Link as RouterLink} from "react-router-dom";
import Drawer from '@mui/material/Drawer';
import {List, ListItem, ListItemButton, ListItemText, styled} from "@mui/material";


const StyledDrawer = styled(List)({
    backgroundColor: "whitesmoke"
});

const NavBar = () => {
    return (
        <Drawer anchor="left" variant="permanent">
            <StyledDrawer>
                <ListItem>
                    <ListItemButton component={RouterLink} to="/project">
                        <ListItemText primary="Projects"/>
                    </ListItemButton>
                </ListItem>

                <ListItem>
                    <ListItemButton component={RouterLink} to="/robot">
                        <ListItemText primary="Robots"/>
                    </ListItemButton>
                </ListItem>

                <ListItem>
                    <ListItemButton component={RouterLink} to="/template">
                        <ListItemText primary="Templates"/>
                    </ListItemButton>
                </ListItem>
            </StyledDrawer>
        </Drawer>
    );
}

export default NavBar;
