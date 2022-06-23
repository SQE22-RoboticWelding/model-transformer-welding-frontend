class Settings {
    static host = "http://localhost:8000";
    static basePath = "/api/v1"
    static backendBase = `${Settings.host}${Settings.basePath}`;

    static projectsPath = `${Settings.backendBase}/project`;
    static uploadPath = `${Settings.projectsPath}/upload`;

    static weldingPointsPath = `${Settings.backendBase}/weldingpoint`;

    static robotTypePath = `${Settings.backendBase}/robottype`;
    static robotPath = `${Settings.backendBase}/robot`;
}

export default Settings;
