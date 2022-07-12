import {Grid} from "@mui/material";


const TemplateDetails = ({template}) => {
    return (
        <Grid container direction="column">
            <Grid item>Description</Grid>
            <Grid item>{template.description}</Grid>
        </Grid>
    );
};

export default TemplateDetails;
