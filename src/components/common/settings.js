class Settings {
    static host = "http://localhost:8000";
    static basePath = "/api/v1"
    static backendBase = `${Settings.host}${Settings.basePath}`;

    static projectsPath = `${Settings.backendBase}/project`;
    static uploadPath = `${Settings.projectsPath}/upload`;
    static validateGeneratePath = (projectID) => `${Settings.projectsPath}/${projectID}/generate/validate`;
    static generatePath = (projectID) => `${Settings.projectsPath}/${projectID}/generate`;
    static generateValidatePath = (projectID) => `${Settings.projectsPath}/${projectID}/generate/validate`;

    static weldingPointsPath = `${Settings.backendBase}/weldingpoint`;

    static robotTypePath = `${Settings.backendBase}/robottype`;
    static robotPath = `${Settings.backendBase}/robot`;

    static templatePath = `${Settings.backendBase}/generationtemplate`;
    static templateLibraryPath = `${Settings.templatePath}/librarytemplates`
}

export default Settings;
