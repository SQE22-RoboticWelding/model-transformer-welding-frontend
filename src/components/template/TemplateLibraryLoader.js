import {Button, Dialog, DialogTitle, Divider, List, ListItem, Tooltip, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import FetchHandler from "../common/FetchHandler";
import Settings from "../common/settings";
import Notifications from "../common/Notifications";
import TemplateDetailList from "./TemplateDetailList";


const retrieveLibraryTemplates = () => new Promise((resolve, reject) => {
    FetchHandler.readingJson(fetch(Settings.templateLibraryPath, {method: "GET"}))
        .then(resolve)
        .catch((err) => {
            Notifications.notify(`Failed to retrieve library templates\n${err}`, "error");
            reject();
        });
});

const TemplateLibraryLoader = ({onTemplateChosen}) => {
    const [retrievalState, setRetrievalState] = useState("idle");
    const [libraryTemplates, setLibraryTemplates] = useState([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setRetrievalState("loading");
        retrieveLibraryTemplates()
            .then(setLibraryTemplates)
            .finally(() => setRetrievalState("idle"));
    }, []);

    const onChoose = (template) => {
        onTemplateChosen(template);
        setOpen(false);
    };

    return (
        <>
            <Button variant="outline" fullWidth onClick={() => setOpen(true)}>
                Choose pre-defined template
            </Button>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>
                    Choose pre-defined template
                </DialogTitle>
                {retrievalState === "idle" ? (
                    <List>
                        {libraryTemplates
                            .sort((template) => `${template.id}${template.version}`)
                            .map((template, idx, array) => (
                                <>
                                    {idx > 0 && array[idx - 1].id === template.id &&
                                        <Divider/>
                                    }
                                    <ListItem key={template.id}>
                                        <Tooltip title={<TemplateDetailList template={template}/>} placement="right">
                                            <Button variant="contained" onClick={() => onChoose(template)}>
                                                {template.name} {template.version}
                                            </Button>
                                        </Tooltip>
                                    </ListItem>
                                </>
                            ))}
                    </List>
                ) : retrievalState === "loading" &&
                    <Typography>Loading...</Typography>
                }
            </Dialog>
        </>
    );
};

export default TemplateLibraryLoader;
