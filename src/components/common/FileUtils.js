class FileUtils {
    static readFile = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (evt) => resolve(evt?.target?.result);
        reader.onerror = reject;
        reader.readAsText(file);
    });

    static handleFileUpload = (evt) => new Promise((resolve, reject) => {
        if (evt.target.files?.length > 0) {
            const file = evt.target.files[0];
            FileUtils.readFile(file)
                .then((content) => resolve({name: file.name, content}))
                .catch(reject);
        } else {
            resolve();
        }
    });

    static toDownloadableFle = (name, content) => new File([content], name, {type: "text/plain"});
}

export default FileUtils;
