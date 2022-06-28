import {Grid} from "@mui/material";
import TemplateCreator from "./TemplateCreator";

const TemplatePage = () => {
    return (
        <Grid container direction="column" alignItems="center" rowGap="24px">
            <TemplateCreator/>
        </Grid>
    );
};

export default TemplatePage;
