patient_map = new Map();
fetched = false;
ajaxcount = 0;

condition_api = function(id) {
    console.log('Called');
    $.ajax({
        type: "GET",
        url: "https://sb-fhir-stu3.smarthealthit.org/smartstu3/open/Condition?patient="+id+"&_count=10&_getpagesoffset=0",
        headers: {
            Accept: "application/json; charset=utf-8"
        },
        success: function (result) {
            disorders = [];
            if(result.total != 0) {
                for(k = 0; k < result.entry.length; k++) {
                    d = result.entry[k].resource.code.text;
                    if(d.indexOf('(disorder)') > -1) {
                        d = d.substring(0,d.indexOf('(disorder)')-1);
                    }
                    else if(d.indexOf('(situation)') > -1) {
                        d = d.substring(0,d.indexOf('(situation)')-1);
                    }
                    disorders.push(d);
                }
                o = patient_map.get(id);
                if(o !== undefined)
                    o.disorders = disorders;
            }
        },
        error: function (result) {
            alert('Some error');
        }
    });
};
function updateProgress(percentage){
    if(percentage > 100) percentage = 100;
    $('#progressBar').css('width', percentage+'%');
    $('#progressBar').html(percentage+'%');
}

patient_api = function(k) {
    $.ajax({
        type: "GET",
        url: "https://sb-fhir-stu3.smarthealthit.org/smartstu3/open/Patient?_count=10&_getpagesoffset="+(k*10),
        headers: {
            Accept: "application/json; charset=utf-8"
        },
        success: function (result) {
            ajaxcount += 1;
            updateProgress(ajaxcount);
            for(i=0;i<result.entry.length;i++) {
                p = result.entry[i];
                if(patient_map.get(p.resource.id) === undefined) {
                    patient_map.set(p.resource.id, {id: p.resource.id});
                    o = patient_map.get(p.resource.id);
                    o.name = p.resource.name[0].given + ' ' + p.resource.name[0].family;
                    for (e = 0; e < p.resource.extension.length; e++) {
                        if (p.resource.extension[e].url == 'http://hl7.org/fhir/us/core/StructureDefinition/us-core-race') {
                            o.race = p.resource.extension[e].valueCodeableConcept.coding[0].display;
                        }
                        else if (p.resource.extension[e].url == 'http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity') {
                            o.ethnicity = p.resource.extension[e].valueCodeableConcept.coding[0].display;
                        }
                        else if (p.resource.extension[e].url == 'http://hl7.org/fhir/StructureDefinition/birthPlace') {
                            o.birthCity = p.resource.extension[e].valueAddress.city;
                            o.birthState = p.resource.extension[e].valueAddress.state;
                        }
                    }
                    o.gender = p.resource.gender;
                    o.birthDate = p.resource.birthDate;
                    o.age = new Date().getFullYear() - parseInt(o.birthDate.substring(0, 4));
                    o.maritalStatus = p.resource.maritalStatus.coding[0].code;
                    o.language = p.resource.communication[0].language.coding[0].display;
                    o.currentCity = p.resource.address[0].city;
                    o.currentState = p.resource.address[0].state;
                    o.gpsLocation = {
                        latitude: p.resource.address[0].extension[0].extension[0].valueDecimal,
                        longitude: p.resource.address[0].extension[0].extension[1].valueDecimal
                    };
                    condition_api(o.id);
                }
                else {
                    console.log('Already Present')
                }
            }
            if(ajaxcount == 100) {
                fetched = true;
                ajaxcount += 1;
            }
            if(fetched) {
                swal(
                    'Fetched',
                    'New FHIR Data is successfully fetched',
                    'success'
                );
                fetched = false;
            }
        },
        error: function (result) {
            alert('Some error');
        }
    });
};

myFunction = function() {
    patient_map.clear();
    fetched = false;
    ajaxcount = 0;
    updateProgress(0);
    for(m = 0; m < 100; m++) {
        //patient_api(Math.floor(Math.random()*50));
        patient_api(m);
    }
};

initialFunc = function() {
    var data = [{
        x: [],
        y: [],
        type: 'bar'
    }];

    Plotly.newPlot('myDiv', []);
};

checkDataLoaded = function() {
    if(patient_map.size == 0) {
        swal(
            'No Data Available',
            'Please click on \"Fetch FHIR Data\" button',
            'error'
        );
    }
};