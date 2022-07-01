import {Button, List, ListItem, TextField} from "@mui/material";
import {useState} from "react";
import {ListItemSpreadingChildren} from "../common/StyledComponents";


const DEFAULT_NAME_HELPER = "Name";
const DEFAULT_DESCRIPTION_HELPER = "Description";
const DEFAULT_CONTENT_HELPER = "Content";
const EMPTY_TEMPLATE = {
    name: "",
    description: "",
    content: ""
};

const TemplateContentPreviewInputProps = {
    style: {
        fontFamily: "monospace",
        fontSize: 11,
        minWidth: "max-content"
    }
};

const TemplatePropertyEditor = ({submissionText, onSubmit, onCancel, template = EMPTY_TEMPLATE}) => {
    const [name, setName] = useState(template.name);
    const [description, setDescription] = useState(template.description);
    const [content, setContent] = useState(template.content);

    const [contentHelper, setContentHelper] = useState(DEFAULT_CONTENT_HELPER);
    const [nameHelper, setNameHelper] = useState(DEFAULT_NAME_HELPER);

    const onValidatedSubmit = () => {
        let validated = true;
        if (!name) {
            setNameHelper("Name must be given");
            validated = false;
        } else {
            setNameHelper(DEFAULT_NAME_HELPER);
        }
        if (!content) {
            setContentHelper("Content must be given");
            validated = false;
        } else {
            setContentHelper(DEFAULT_CONTENT_HELPER);
        }

        if (validated) {
            onSubmit({name, description, content});
        }
    };

    return (
        <List>
            <ListItem>
                <TextField
                    variant="outlined"
                    error={DEFAULT_NAME_HELPER !== nameHelper}
                    helperText={nameHelper}
                    placeholder="Type name here ..."
                    fullWidth
                    value={name}
                    onChange={(evt) => setName(evt.target.value)}
                />
            </ListItem>

            <ListItem>
                <TextField
                    variant="outlined"
                    helperText={DEFAULT_DESCRIPTION_HELPER}
                    placeholder="Type description here ..."
                    fullWidth
                    value={description}
                    onChange={(evt) => setDescription(evt.target.value)}
                />
            </ListItem>

            <ListItem>
                <TextField
                    variant="outlined"
                    error={DEFAULT_CONTENT_HELPER !== contentHelper}
                    helperText={contentHelper}
                    placeholder="Type template content here ..."
                    InputProps={TemplateContentPreviewInputProps}
                    multiline
                    fullWidth
                    value={content}
                    onChange={(evt) => setContent(evt.target.value)}
                />
            </ListItem>

            <ListItemSpreadingChildren>
                <Button variant="outlined" onClick={onValidatedSubmit}>
                    {submissionText}
                </Button>

                <Button variant="text" onClick={onCancel}>
                    Cancel
                </Button>
            </ListItemSpreadingChildren>
        </List>
    );
};

export default TemplatePropertyEditor;
