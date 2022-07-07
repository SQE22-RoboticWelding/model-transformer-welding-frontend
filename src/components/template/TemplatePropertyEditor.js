import {Button, List, ListItem, ListItemText, TextField} from "@mui/material";
import {useState} from "react";
import {ListItemSpreadingChildren} from "../common/StyledComponents";
import TemplateLibraryLoader from "./TemplateLibraryLoader";


const DEFAULT_NAME_HELPER = "Name";
const DEFAULT_DESCRIPTION_HELPER = "Description";
const DEFAULT_LANGUAGE_HELPER = "Language";
const DEFAULT_FILE_EXTENSION_HELPER = "File extension";
const DEFAULT_VERSION_HELPER = "Version";
const DEFAULT_CONTENT_HELPER = "Content";
const EMPTY_TEMPLATE = {
    name: "",
    description: "",
    language: "",
    file_extension: "",
    version: "",
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
    const [language, setLanguage] = useState(template.language);
    const [fileExtension, setFileExtension] = useState(template.file_extension);
    const [version, setVersion] = useState(template.version);
    const [content, setContent] = useState(template.content);

    const [fileName, setFileName] = useState("");

    const [nameHelper, setNameHelper] = useState(DEFAULT_NAME_HELPER);
    const [languageHelper, setLanguageHelper] = useState(DEFAULT_LANGUAGE_HELPER);
    const [versionHelper, setVersionHelper] = useState(DEFAULT_VERSION_HELPER);
    const [contentHelper, setContentHelper] = useState(DEFAULT_CONTENT_HELPER);

    const onLibraryTemplateChosen = (template) => {
        setName(template.name);
        setDescription(template.description);
        setLanguage(template.language);
        setFileExtension(template.file_extension);
        setVersion(template.version);
        setContent(template.content);
        setTimeout(validate, 100);
    };

    const validate = () => {
        let validated = true;
        if (!name) {
            setNameHelper("Name must be given");
            validated = false;
        } else {
            setNameHelper(DEFAULT_NAME_HELPER);
        }
        if (!language) {
            setLanguageHelper("Language must be given");
            validated = false;
        } else {
            setLanguageHelper(DEFAULT_LANGUAGE_HELPER);
        }
        if (!version) {
            setVersionHelper("Version must be given");
            validated = false;
        } else {
            setVersionHelper(DEFAULT_VERSION_HELPER);
        }
        if (!content) {
            setContentHelper("Content must be given");
            validated = false;
        } else {
            setContentHelper(DEFAULT_CONTENT_HELPER);
        }
        return validated;
    };

    const onValidatedSubmit = () => {
        if (validate()) {
            onSubmit({name, description, language, fileExtension, version, content});
        }
    };

    const handleFileUpload = (evt) => {
        if (evt.target.files?.length > 0) {
            const file = evt.target.files[0];
            setFileName(file.name);

            const reader = new FileReader();
            reader.onload = (evt) => {
                const data = evt?.target?.result;
                if (data) {
                    setContent(data);
                }
            };
            reader.readAsText(file);
        }
    };

    return (
        <List>
            <ListItem>
                <TemplateLibraryLoader onTemplateChosen={onLibraryTemplateChosen}/>
            </ListItem>

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
                    error={DEFAULT_LANGUAGE_HELPER !== languageHelper}
                    helperText={languageHelper}
                    placeholder="Type language here ..."
                    fullWidth
                    value={language}
                    onChange={(evt) => setLanguage(evt.target.value)}
                />
            </ListItem>

            <ListItem>
                <TextField
                    variant="outlined"
                    helperText={DEFAULT_FILE_EXTENSION_HELPER}
                    placeholder="Type file extension here ..."
                    fullWidth
                    value={fileExtension}
                    onChange={(evt) => setFileExtension(evt.target.value)}
                />
            </ListItem>

            <ListItem>
                <TextField
                    variant="outlined"
                    error={DEFAULT_VERSION_HELPER !== versionHelper}
                    helperText={versionHelper}
                    placeholder="Type version here ..."
                    fullWidth
                    value={version}
                    inputProps={{type: "number", step: 0.01}}
                    onChange={(evt) => setVersion(Number(evt.target.value).toFixed(2))}
                />
            </ListItem>

            <ListItem>
                <Button component="label" variant="outlined" fullWidth>
                    Upload Template
                    <input type="file" hidden onChange={handleFileUpload}/>
                </Button>
            </ListItem>

            {!!fileName &&
            <ListItem>
                <ListItemText>
                    File name: <i>{fileName}</i>
                </ListItemText>
            </ListItem>
            }

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
