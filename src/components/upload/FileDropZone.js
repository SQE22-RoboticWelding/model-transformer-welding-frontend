
/*import DropZone from "react-dropzone";*/
import { DropzoneAreaBase } from 'material-ui-dropzone';
import {styled} from '@mui/system';

const DropZoneRoot = styled('div')({
     width : '100%',
     height: 200,
     border: 4 ,
     borderStyle : 'dashed' ,
     borderColor : '#AFAFAF',
     display : "flex",
     flexDirection : "column",
     justifyContent : "space-between",
     alignItems : "center",
     cursor : "pointer", 
     '&:hover' : {
        background: '#FFFFFF',
        border: 4 ,
        borderColor : '#AFAFAF'
     }

  });
  const FileNameDisplay = styled('div')({
     color : '#888888'
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
        <DropzoneAreaBase acceptedFiles = {[".xls", ".xlsx",".csv"]} filesLimit= {1} onDrop={onDrop} showFileNames = {true} >
            {(state) => (
                <DropZoneRoot {...state.getRootProps()}>
                    <input {...state.getInputProps()}/>
                    <div>Drag & Drop or Click</div>
                    {file &&
                        <FileNameDisplay>Selected file: {file.name}</FileNameDisplay>
                    }
                </DropZoneRoot>
            )}
        </DropzoneAreaBase>
    );
};

export default FileDropZone;
