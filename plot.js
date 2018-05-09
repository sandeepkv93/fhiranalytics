main_disorders = [
    "Viral sinusitis",
    "Prediabetes",
    "Osteoporosis",
    "Hypertension",
    "Alzheimer\'s disease",
    "Concussion injury of brain",
    "Childhood asthma",
    "Coronary Heart Disease",
    "Acute bronchitis",
    "Diabetes",
    "Asthma",
    "Stroke",
    "Appendicitis",
    "Sinusitis",
    "Cardiac Arrest",
    "Drug overdose",
    "Pneumonia"
];

Map.prototype.getOrElse = function (key, value) {
    return this.has(key) ? this.get(key) : value
};

disordermapping = new Map();
disordermapping.set(2, "Asthma");
disordermapping.set(3, "Diabetes");
disordermapping.set(4, "Alzheimer\'s disease");
disordermapping.set(5, "Cardiac Arrest");
disordermapping.set(6, "Drug overdose");
disordermapping.set(7, "Pneumonia");
disordermapping.set(8, "Childhood asthma");
disordermapping.set(9, "Hypertension");
disordermapping.set(10, "Viral sinusitis");

parammapping = new Map();
parammapping.set(2, 'gender');
parammapping.set(4, 'birthCity');
parammapping.set(5, 'birthState');
parammapping.set(6, 'maritalStatus');
parammapping.set(7, 'currentCity');
parammapping.set(8, 'currentState');
parammapping.set(9, 'race');
parammapping.set(10, 'ethnicity');


Map.prototype.getOrElse = function (key, value) {
    return this.has(key) ? this.get(key) : value
};

var barlayout = {
    font: {
        family: 'Raleway, snas-serif'
    },
    showlegend: false,
    xaxis: {
        tickangle: -45
    },
    yaxis: {
        zeroline: false,
        gridwidth: 2
    },
    bargap: 0.05
};

checkValidParameters = function () {
    if ($('#combination1').val() == null || $('#combination2').val() == null) {
        swal(
            'All parameters not selected',
            'Please X-Axis and Y-Axis Parameters to plot',
            'error'
        );
        return false;
    }
    if (parseInt($('#combination2').val()) == 1 && parseInt($('#combination1').val()) != 1) {
        swal(
            'Invalid Parameters',
            'Please X-Axis and Y-Axis Parameters which make sense!',
            'error'
        );
        return false;
    }
    return true;
};

paramVsDisorder = function (disorder, param) {
    paramMap = new Map();
    patient_map.forEach(function (item, key, mapObj) {
        d = item.disorders;
        if (d !== undefined) {
            if (d.indexOf(disorder) > -1) {
                paramMap.set(item[param], paramMap.getOrElse(item[param], 0) + 1);
            }
        }
    });
    xvals = [];
    yvals = [];
    paramMap.forEach(function (item, key, mapObj) {
        xvals.push(key);
        yvals.push(item);
    });

    var data = [{
        x: xvals,
        y: yvals,
        type: 'bar'
    }];

    barlayout.title = 'Number of ' + disorder + ' Patients Vs ' + param;
    barlayout.xaxis.title = param;
    barlayout.yaxis.title = 'Number of ' + disorder + ' Patients';
    Plotly.newPlot('myDiv', data, barlayout);
};

ageVsDisorder = function (disorder) {
    ageMap = new Map();
    patient_map.forEach(function (item, key, mapObj) {
        d = item.disorders;
        if (d !== undefined) {
            if (d.indexOf(disorder) > -1) {
                ageMap.set(item.age, ageMap.getOrElse(item.age, 0) + 1);
            }
        }
    });
    ageGroupMap = new Map();
    ageMap.forEach(function (item, key, mapObj) {
        ageGroupMap.set(parseInt(key / 5), ageGroupMap.getOrElse(parseInt(key / 5), 0) + item);
    });
    ag = Array.from(ageGroupMap.keys());
    ag.sort((a, b) => a - b);
    xvals = ag.map(function (x) {
        return '' + (x * 5) + ' - ' + ((x + 1) * 5) + '';
    });
    yvals = ag.map(function (x) {
        return ageGroupMap.get(x);
    });
    var data = [{
        x: xvals,
        y: yvals,
        type: 'bar'
    }];
    barlayout.title = 'Number of ' + disorder + ' Patients Vs Age-group';
    barlayout.xaxis.title = 'Age-group';
    barlayout.yaxis.title = 'Number of ' + disorder + ' Patients';
    Plotly.newPlot('myDiv', data, barlayout);
};

numPatientsVsDisorders = function () {
    dis = new Map();
    patient_map.forEach(function (item, key, mapObj) {
        d = item.disorders;
        if (d !== undefined) {
            for (ff = 0; ff < d.length; ff++) {
                if (main_disorders.indexOf(d[ff]) > -1) {
                    dis.set(d[ff], 0);
                }
            }
        }
    });

    patient_map.forEach(function (item, key, mapObj) {
        d = item.disorders;
        if (d !== undefined) {
            for (ff = 0; ff < d.length; ff++) {
                if (main_disorders.indexOf(d[ff]) > -1) {
                    dis.set(d[ff], dis.get(d[ff]) + 1);
                }
            }
        }
    });

    xvals = [];
    yvals = [];
    dis.forEach(function (item, key, mapObj) {
        xvals.push(key);
        yvals.push(item);
    });

    var data = [{
        x: xvals,
        y: yvals,
        type: 'bar'
    }];

    barlayout.title = 'Number of Patients Vs Disorders';
    barlayout.xaxis.title = 'Disorder';
    barlayout.yaxis.title = 'Number of Patients';
    Plotly.newPlot('myDiv', data, barlayout);
};

numPatientsVsAge = function () {
    ageMap = new Map();
    patient_map.forEach(function (item, key, mapObj) {
        ageMap.set(item.age, ageMap.getOrElse(item.age, 0) + 1);
    });
    ageGroupMap = new Map();
    ageMap.forEach(function (item, key, mapObj) {
        ageGroupMap.set(parseInt(key / 5), ageGroupMap.getOrElse(parseInt(key / 5), 0) + item);
    });
    ag = Array.from(ageGroupMap.keys());
    ag.sort((a, b) => a - b);
    xvals = ag.map(function (x) {
        return '' + (x * 5) + ' - ' + ((x + 1) * 5) + '';
    });
    yvals = ag.map(function (x) {
        return ageGroupMap.get(x);
    });
    var data = [{
        x: xvals,
        y: yvals,
        type: 'bar'
    }];
    barlayout.title = 'Number of Patients Vs Age-group';
    barlayout.xaxis.title = 'Age Group';
    barlayout.yaxis.title = 'Number of Patients';
    Plotly.newPlot('myDiv', data, barlayout);
};

numPatientsVsParams = function (yaxis) {
    if (yaxis == 3) {
        numPatientsVsAge();
        return;
    }
    else {
        param = parammapping.get(yaxis);
        paramMap = new Map();
        patient_map.forEach(function (item, key, mapObj) {
            paramMap.set(item[param], paramMap.getOrElse(item[param], 0) + 1);
        });
        xvals = [];
        yvals = [];
        paramMap.forEach(function (item, key, mapObj) {
            xvals.push(key);
            yvals.push(item);
        });

        var data = [{
            x: xvals,
            y: yvals,
            type: 'bar'
        }];

        barlayout.title = 'Number of Patients Vs ' + param;
        barlayout.xaxis.title = param;
        barlayout.yaxis.title = 'Number of Patients';
        Plotly.newPlot('myDiv', data, barlayout);
    }
};

plotGraph = function () {
    validity = checkValidParameters();
    if (!validity)
        return;
    xaxis = parseInt($('#combination1').val());
    yaxis = parseInt($('#combination2').val());
    if (xaxis == 1 && yaxis == 1) {
        numPatientsVsDisorders();
    }
    else if (xaxis == 1) {
        numPatientsVsParams(yaxis);
    }
    else if (yaxis == 3) {
        ageVsDisorder(disordermapping.get(xaxis));
    }
    else {
        paramVsDisorder(disordermapping.get(xaxis), parammapping.get(yaxis));
    }
};