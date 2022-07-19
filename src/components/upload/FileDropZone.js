import DropZone from "react-dropzone";
import {styled} from '@mui/system';

const DropZoneRoot = styled('div')({
    width: '100%',
    height: '200px',
    border: '4px dashed #AFAFAF',
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer"

});
const FileNameDisplay = styled('div')({
    color: '#888888'
});

const ACCEPTED_FILETYPES = {
    "text/xls": [".xls", ".xlsx"],
    "text/csv": [".csv"]
};

const FileDropZone = ({file, onFile}) => {
    const onDrop = (e) => {
        if (e.length) {
            onFile(e[0]);
        }
    };
    return (
        <DropZone accept={ACCEPTED_FILETYPES} multiple={false} onDrop={onDrop}>
            {(state) => (
                <DropZoneRoot {...state.getRootProps()}>
                    <input {...state.getInputProps()}/>
                    <div>Drag & Drop or Click</div>
                    {file &&
                        <FileNameDisplay>Selected file: {file.name}</FileNameDisplay>
                    }
                </DropZoneRoot>
            )}
        </DropZone>
    );
};

export default FileDropZone;
