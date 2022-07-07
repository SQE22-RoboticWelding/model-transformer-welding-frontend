import {List, ListItem, ListItemText, styled} from "@mui/material";

const Text = styled(ListItemText)({
    "> span": {
        fontSize: "12px"
    }
});

const TemplateDetailList = ({template}) => {
    return (
        <List>
            <ListItem>
                <Text>
                    Language:
                </Text>
                <Text>
                    {template.language}
                </Text>
            </ListItem>
            <ListItem>
                <Text>
                    Description:
                </Text>
                <Text>
                    {template.description}
                </Text>
            </ListItem>
            <ListItem>
                <Text>
                    File extension:
                </Text>
                <Text>
                    {template.file_extension}
                </Text>
            </ListItem>
        </List>
    );
};

export default TemplateDetailList;
