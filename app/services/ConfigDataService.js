angular.module("RadCalc.services").factory("ConfigDataService", function() {

    var data = {
        "categories": [
            {
                "id": "CT",
                "name": "X-ray Computed Tomography Examinations",
                "headers": ["Study", "Examination", "# Scans", "Standard of Care?", "Gender Predominance", "", "EDE (mSv)", "# Scans/year", "Annual EDE (mSv)"],
                "defaultrow": { "id": 0, "categoryid": "CT", "exam": "", "scans": 1, "soc": false, "gender": "mixed", "ede": 0, "annualscans": 1, "annualede": 0 }
            },
            {
                "id": "NM",
                "name": "Nuclear Medicine Examinations",
                "headers": ["Study", "Examination", "# Scans", "Standard of Care?", "Gender Predominance", "Injected Dose (mCi)", "EDE (mSv)", "# Scans/year", "Annual EDE (mSv)"],
                "defaultrow": { "id": 0, "categoryid": "NM", "exam": "", "scans": 1, "soc": false, "gender": "mixed", "injectedDose": 0, "ede": 0, "annualscans": 1, "annualede": 0 }
            },
            {
                "id": "XRay",
                "name": "X-ray Examinations",
                "headers": ["Study", "Examination", "# Scans", "Standard of Care?", "Gender Predominance", "", "EDE (mSv)", "# Scans/year", "Annual EDE (mSv)"],
                "defaultrow": { "id": 0, "categoryid": "XRay", "exam": "", "scans": 1, "soc": false, "gender": "mixed", "ede": 0, "annualscans": 1, "annualede": 0 }
            },
            {
                "id": "Flouro",
                "name": "Flouroscopy Examinations",
                "headers": ["Study", "Examination", "# Scans", "Standard of Care?", "Gender Predominance", "Minutes", "EDE (mSv)", "# Scans/year", "Annual EDE (mSv)"],
                "defaultrow": { "id": 0, "categoryid": "Flouro", "exam": "", "scans": 1, "soc": false, "gender": "mixed", "minutes": 0, "ede": 0, "annualscans": 1, "annualede": 0 }
            }
        ]
    };

    getNameForId = function(id) {
        var index, category;
        for (index in data.categories) {
            category = data.categories[index];
            if (category.id === id) {
                return category.name;
            }
        }
        return id;
    };

    return {
        "data": data,
        "getNameForId": getNameForId
    };

});