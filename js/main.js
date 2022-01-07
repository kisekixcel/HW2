function deleteATS() {
    var promise = {
        method: 'DELETE'
    };
    return axios.delete('/api/ats/delete-ats', promise).then(function (response) {
        console.log(response);
        return response;
    }).catch(function (error) {
        if (error.response) {
            throw new Error(JSON.stringify(error.response.data));
        }
        return error.response.data;
    });
}

function generateATS(atsCode) {

    var promise = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    return axios.post('/api/ats', { ats: atsCode }, promise).then(function (response) {
        console.log(response);
        return response;
    }).catch(function (error) {
        if (error.response) {
            throw new Error(JSON.stringify(error.response.data));
        }
        return error.response.data;
    });
}

// function generateRandomATS1() {
//     return fetch(`/api/ats/random`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       })
//     .then(function (response) {
//         console.log(response)
//         return response.json();
//     })
//     .then(function (json) {
//         if (json.error) {
//             throw new Error(json.error);
//         }
//         console.log(json.random)
//         return json.random
//     })
// }

function generateRandomATS() {
    return fetch('/api/ats/random-ats', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(function (response) {
        console.log(response);
        return response.json();
    }).then(function (json) {
        if (json.error) {
            throw new Error(json.error);
        }
        return json.random;
    }).catch(function (error) {
        console.log(error.message);
        if (error) {
            throw new Error(error.message);
        }
        return error.message;
    });
}

function getAtsCode() {
    var promise = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    return axios.get('/api/ats/1', promise).then(function (response) {
        console.log(response);
        return response.data;
    }).catch(function (error) {
        console.log(error);
        if (error.response) {
            throw new Error(JSON.stringify(error.response.data));
        }
        return error.response.data;
    });
}

window.addEventListener('DOMContentLoaded', function () {
    var atsGeneratorButton = document.getElementById('ATS-Generator');
    var atsRandomGeneratorButton = document.getElementById('ATS-RandomGenerator');
    var atsInput = document.getElementById('ATS-Code');
    var GeneratedATS = document.getElementById('GeneratedATS');
    var submitButton = document.getElementById('ATS-Submit');
    var ATSCodeInput = document.getElementById('ATSCodeInput');
    var statusField = document.getElementById('status');
    var overlayLoading = document.getElementById('loading');

    function displayATS(ats) {
        if (ats) {
            GeneratedATS.innerHTML = ats;
        } else {
            console.log(response)
            return getAtsCode().then(function (response) {
                GeneratedATS.innerHTML = response.ats;
            }).catch(function (error) {
                GeneratedATS.innerHTML = JSON.parse(error.message).error;
            }).finally(function () {
                overlayLoading.hidden = true;
            });
        }
    }

    atsGeneratorButton.onclick = function () {
        atsGeneratorButton.disabled = true;
        atsCode = atsInput.value;
        generateATS(atsCode).catch(function (errors) {
            alert(JSON.parse(errors.message).error);
        }).finally(function () {
            displayATS();
            atsGeneratorButton.disabled = false;
        });
    };

    atsRandomGeneratorButton.onclick = function () {
        atsRandomGeneratorButton.disabled = true;
        generateRandomATS().then(function (ats) {
            displayATS(ats);
        }).catch(function (errors) {
            alert(errors.message);
        }).finally(function () {
            atsRandomGeneratorButton.disabled = false;
        });
    };

    function verifyATS(SubmittedATSCode) {
        return getAtsCode().then(function (response) {
            if (response.ats == SubmittedATSCode) {
                statusField.innerHTML = "ATS is verified";
                deleteATS();
            } else {
                statusField.innerHTML = "Wrong ATS Entered";
            }
            return response.ats;
        }).then(function (json) {
            if (json.error) {
                throw new Error(json.error);
            }
            return json;
        });
    }

    submitButton.onclick = function () {
        submitButton.disabled = true;
        SubmittedATSCode = ATSCodeInput.value;

        verifyATS(SubmittedATSCode).catch(function (error) {
            alert(error.message);
        }).finally(function () {
            submitButton.disabled = false;
        });
    };

    displayATS();
});