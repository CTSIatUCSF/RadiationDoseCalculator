angular.module("RadCalc.services").factory("ConfigDataService", function() {

    return {
        "data": {
            "categories": [
                {
                    "id": "CT",
                    "name": "X-ray Computed Tomography Examinations",
                    "headers": ["Study", "Examination", "# Scans", "Standard of Care?", "Gender Predominance", "", "EDE (mSv)"],
                    "defaultrow": { "id": 0, "categoryid": "CT", "exam": "", "scans": 0, "soc": false, "gender": "mixed", "ede": 0 }
                },
                {
                    "id": "NM",
                    "name": "Nuclear Medicine Examinations",
                    "headers": ["Study", "Examination", "# Scans", "Standard of Care?", "Gender Predominance", "Injected Dose (mCi)", "EDE (mSv)"],
                    "defaultrow": { "id": 0, "categoryid": "NM", "exam": "", "scans": 0, "soc": false, "gender": "mixed", "injectedDose": 0, "ede": 0 }
                },
                {
                    "id": "XRay",
                    "name": "X-ray Examinations",
                    "headers": ["Study", "Examination", "# Scans", "Standard of Care?", "Gender Predominance", "", "EDE (mSv)"],
                    "defaultrow": { "id": 0, "categoryid": "XRay", "exam": "", "scans": 0, "soc": false, "gender": "mixed", "ede": 0 }
                },
                {
                    "id": "Flouro",
                    "name": "Flouroscopy Examinations",
                    "headers": ["Study", "Examination", "# Scans", "Standard of Care?", "Gender Predominance", "Minutes", "EDE (mSv)"],
                    "defaultrow": { "id": 0, "categoryid": "Flouro", "exam": "", "scans": 0, "soc": false, "gender": "mixed", "minutes": 0, "ede": 0 }
                }
            ]
        }
    };

});