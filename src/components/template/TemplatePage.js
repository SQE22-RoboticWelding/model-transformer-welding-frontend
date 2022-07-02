import {Accordion, AccordionDetails, AccordionSummary, Grid, Paper, Typography} from "@mui/material";
import TemplateCreator from "./TemplateCreator";
import {useEffect, useState} from "react";
import FetchHandler from "../common/FetchHandler";
import Settings from "../common/settings";
import Notifications from "../common/Notifications";
import {TypographyTextCentered} from "../common/StyledComponents";
import TemplateEditor from "./TemplateEditor";
import TemplateDeletor from "./TemplateDeletor";
import {styled} from "@mui/material";


const TemplateAccordion = styled(Accordion)({
    width: "100%"
});

const Bold = styled(Typography)({
    marginRight: "8px",
    fontWeight: "bold"
});

const CodeBlock = styled(Paper)({
    margin: "12px 24px",
    padding: "1em",
    fontFamily: "monospace",
    whiteSpace: "pre-line"
});

const retrieveTemplates = () => new Promise((resolve, reject) => {
    FetchHandler.readingJson(fetch(Settings.templatePath), {method: "GET"})
        .then(resolve)
        .catch((err) => {
            Notifications.notify(`Failed to get templates\n${err}`, "error");
            reject();
        });
});

const TemplatePage = () => {
    const [templates, setTemplates] = useState([]);
    const [templateRetrievalState, setTemplateRetrievalState] = useState("idle");
    const [openedTemplateId, setOpenedTemplateId] = useState(undefined);

    const getTemplates = () => {
        setTemplateRetrievalState("loading");
        retrieveTemplates()
            .then(setTemplates)
            .finally(() => setTemplateRetrievalState("idle"));
    };

    const toggleAccordion = (templatId) => {
        if (openedTemplateId === templatId) {
            setOpenedTemplateId(undefined);
        } else {
            setOpenedTemplateId(templatId)
        }
    };

    useEffect(() => getTemplates, []);

    return (
        <Grid container direction="column" alignItems="center" rowGap="24px">
            <TemplateCreator onCreated={getTemplates}/>

            {templateRetrievalState === "idle" && templates.length > 0 ? (
                templates.map((template) => (
                    <TemplateAccordion
                        key={template.id}
                        expanded={openedTemplateId === template.id}
                        onChange={() => toggleAccordion(template.id)}
                    >
                        <AccordionSummary>
                            <Grid container direction="row" justifyContent="space-between">
                                <Grid item display="flex" alignItems="center">
                                    <Typography>
                                        <Bold>Name:</Bold>
                                        {template.name}
                                    </Typography>
                                </Grid>

                                <Grid item>
                                    <TemplateEditor template={template} onTemplateUpdated={getTemplates}/>
                                    <TemplateDeletor template={template} onTemplateDeleted={getTemplates}/>
                                </Grid>
                            </Grid>
                        </AccordionSummary>
                        <AccordionDetails>
                            {Boolean(template.description) && (
                                <Typography>
                                    <Bold>Description:</Bold>
                                    {template.description}
                                </Typography>
                            )}

                            <Typography>
                                <Bold>Content:</Bold>
                            </Typography>
                            <CodeBlock elevation={6} variant="outlined">
                                {template.content}
                            </CodeBlock>
                        </AccordionDetails>
                    </TemplateAccordion>
                ))
            ) : templateRetrievalState === "idle" ? (
                <TypographyTextCentered>There are no templts yet!</TypographyTextCentered>
            ) : (
                <TypographyTextCentered>Loading...</TypographyTextCentered>
            )}
        </Grid>
    );
};

export default TemplatePage;
