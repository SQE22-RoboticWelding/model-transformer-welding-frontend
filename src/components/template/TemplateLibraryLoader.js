import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tooltip,
    Typography
} from "@mui/material";
import {useEffect, useState} from "react";
import FetchHandler from "../common/FetchHandler";
import Settings from "../common/settings";
import Notifications from "../common/Notifications";
import TemplateDetails from "./TemplateDetails";
import CheckIcon from '@mui/icons-material/Check';


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
                <DialogContent>
                    {retrievalState === "idle" ? (
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>File Extension</TableCell>
                                    <TableCell>Language</TableCell>
                                    <TableCell>Version</TableCell>
                                    <TableCell/>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {libraryTemplates
                                    .sort((template) => `${template.id}${template.version}`)
                                    .map((template) => (
                                        <Tooltip title={<TemplateDetails template={template}/>} placement="left">
                                            <TableRow key={template.id}>
                                                <TableCell>{template.name}</TableCell>
                                                <TableCell>{template.file_extension}</TableCell>
                                                <TableCell>{template.language}</TableCell>
                                                <TableCell>{template.version.toFixed(2)}</TableCell>
                                                <TableCell>
                                                    <IconButton onClick={() => onChoose(template)}>
                                                        <CheckIcon/>
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        </Tooltip>
                                    ))}
                            </TableBody>
                        </Table>
                    ) : retrievalState === "loading" &&
                        <Typography>Loading...</Typography>
                    }
                </DialogContent>
            </Dialog>
        </>
    );
};

export default TemplateLibraryLoader;
