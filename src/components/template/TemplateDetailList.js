import {Table, TableCell, TableRow} from "@mui/material";


const TemplateDetailList = ({template}) => {

    return (
        <Table>
            <TableRow>
                <TableCell>Language:</TableCell>
                <TableCell>{template.language}</TableCell>
            </TableRow>

            <TableRow>
                <TableCell>Description:</TableCell>
                <TableCell>{template.description}</TableCell>
            </TableRow>

            <TableRow>
                <TableCell>File extension:</TableCell>
                <TableCell>{template.file_extension}</TableCell>
            </TableRow>
        </Table>
    );
};

export default TemplateDetailList;

