import {Grid, ListItem, styled, Typography} from "@mui/material";

export const Confirmation = (props) => (
    <Grid container display="flex" alignItems="center" padding="14px" margin="6px" borderRadius="10px" {...props}/>
);

export const TypographyTextCentered = styled(Typography)({
    textAlign: "center"
});

export const CustomHr = styled("hr")({
    border: "none",
    height: "3px",
    borderRadius: "1px",
    backgroundColor: "rgba(0, 0, 0, 0.24)"
});

export const ListItemSpreadingChildren = (props) => <ListItem {...props} style={{display: "flex", justifyContent: "space-between"}}/>;
