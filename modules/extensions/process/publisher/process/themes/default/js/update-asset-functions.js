
/*
 *  Copyright (c) 2016, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 *  WSO2 Inc. licenses this file to you under the Apache License,
 *  Version 2.0 (the "License"); you may not use this file except
 *  in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing,
 *  software distributed under the License is distributed on an
 *  "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 *  KIND, either express or implied.w   See the License for the
 *  specific language governing permissions and limitations
 *  under the License.
 *
 */

var pname,pversion;
var tagList = [];
var processTagsObj;
var isEditorActive = false, curWindow;

window.onload = function () {

    loadOverviewDiv();
    getProcessList();
    getProcessTags();
    setProcessDetails();

    $('#tag-box').tokenfield({
        autocomplete: {
            source: allProcessTags,
            delay: 100
        },
        showAutocompleteOnFocus: true
    });

    $('#tag-box').on('tokenfield:createtoken', function (event) {
        var existingTokens = $(this).tokenfield('getTokens');
        $.each(existingTokens, function (index, token) {
            if (token.value === event.attrs.value)
                event.preventDefault();
        });
    });

    $('#stp1').click(function () {
       loadOverviewStep();
    });

    $('#stp2').click(function () {
       loadDetailsStep();
    });

    $('#stp3').click(function () {
        loadAssociationsStep();
    });

};

function loadDetails() {
    $("#overviewDiv").hide();
    $("#detailDiv").show();
    $("#associationDiv").hide();
    $("#textEditorLink").trigger("click");

    if($('#processTextHolder').val()==='true') {
        $('#textadded').addClass('fw fw-check');
    }

    if($('#bpmnAvailableCheck').val()==='true') {
        $('#bpmnadded').addClass('fw fw-check');
    }

    if($('#documentAvailableCheck').val()==='true') {
        $('#docadded').addClass('fw fw-check');
    }

    if($('#flowchartAvailableCheck').val()==='true') {
        $('#flowchartadded').addClass('fw fw-check');
    }
    // loadProcessText();
}

// function getProcessInfo() {
//     tagList = $('#tagbox').val().split(",");
//     var processDetails = {
//         'processName': pname,
//         'processVersion': pversion,
//         'processOwner': $("#pOwner").val(),
//         'processDescription': $("#overview_description").val(),
//         'processTags': tagList.toString(),
//         'image': getImageData()
//     };
//     return (JSON.stringify(processDetails));
// }

function loadProcessText() {
    $.ajax({
        url: '/designer/assets/process/apis/get_process_text?process_text_path=/processText/' + pname + "/" + pversion,
        type: 'GET',
        success: function (data) {
            var response = JSON.parse(data);
            if (response.error === false) {
                $("#processContent").html(response.content);
            } else {
                alertify.error(response.content);
            }
        },
        error: function () {
            alertify.error('Text editor error');
        }
    });
}


function getProcessTags() {
    $.ajax({
        url: '/designer/assets/process/apis/get_process_tags',
        type: 'GET',
        async: false,
        success: function (data) {
            var response = JSON.parse(data);
            if (response.error === false) {
                processTagsObj = JSON.parse(response.content);
                var tagStr = "";
                if ($("#pName").val() != "" && $("#pVersion").val() != "") {
                    var path = "/processes/"+$("#pName").val()+"/" +$("#pVersion").val()
                    for (var key in processTagsObj) {
                        if (processTagsObj.hasOwnProperty(key)) {
                            var processObj = processTagsObj[key];
                            if(processObj[0].path=== path){
                                tagStr += key+",";
                            }
                        }
                    }
                    $('#tag-box').val(tagStr);
                }
            } else {
                alertify.error(response.content);
            }
        },
        error: function () {
            alert.error('Process tag list returning error');
        }
    });
}

function updateProcessText(currentElement) {
    var textContent = tinyMCE.get('processContent').getContent();
    if (textContent == "") {
        if ($(currentElement).attr('id') == 'processTxtSaveBtn') {
            alertify.error('Process content is empty.');
        }
    } else {
        // save the process
        $.ajax({
            url: '/designer/assets/process/apis/save_process_text',
            type: 'POST',
            data: {
                'processName': pname,
                'processVersion': pversion,
                'processText': textContent
            },
            success: function (data) {
                var response = JSON.parse(data);
                if (response.error === false) {
                    if ($(currentElement).attr('id') == 'processTxtSaveBtn') {
                        alertify.success("Successfully saved the process content.");
                        $("#textadded").addClass("fw fw-check");
                    }
                } else {
                    alertify.error(response.content);
                }
            },
            error: function () {
                alertify.error('Process text saving error');
            }
        });
    }
}

function showTextEditr(element) {
    // if ($("#pName").val() == "" || $("#pVersion").val() == "" || $("#pOwner").val() == "") {
    //     alertify.error('please fill the required fields.');
    // } else {
    // saveProcess(element);
    completeTextDetails();
    $("#bpmnEditDiv").hide();
    $("#docEditDiv").hide();
    $("#flowChartView").hide();
    $("#bpmnViewDiv").hide();
    $("#docViewDiv").hide();
    $('#textEditor').addClass("clicked");
    $('#bpmn').removeClass("clicked");
    $('#flowChart').removeClass("clicked");
    $('#doc').removeClass("clicked");

}


function loadTextEditor(element) {
    completeTextDetails();
    $("#processTextEditDiv").show();
    $("#processTextView").hide();
    $("#bpmnEditDiv").hide();
    $("#docEditDiv").hide();
    $("#flowChartView").hide();
    $("#bpmnViewDiv").hide();
    $("#docViewDiv").hide();
    $("#textEditor").addClass("clicked");
    $("#bpmn").removeClass("clicked");
    $("#flowChart").removeClass("clicked");
    $("#doc").removeClass("clicked");

    if ($("#textadded").hasClass("fw-check")) {
        getProcessText();
        if ($(element).attr('id') == 'editText') {
            $("#processTextView").hide();
            $("#processTextEditDiv").show();
            $(".active").removeClass("active");
            $("#processTextEditDiv").addClass("active");
        }
        else {
            // $("#processTextEditDiv").hide();
            // $("#processTextView").show();
            $(".active").removeClass("active");
        }
    } else {
        $("#processTextView").hide();
        $("#processTextEditDiv").show();
        $(".active").removeClass("active");
        $("#processTextEditDiv").addClass("active");

        tinymce.init({
            selector: "#processContent",
            init_instance_callback : "textEditorInit"
        });
    }
}

function editProcessTxt(element) {

    $("#processTextEditDiv").show();
    $("#processTextView").hide();
    showTextEditr(element);
}


function editAssociatedFlowChart(element, flowchartPath) {
    // if ($("#pName").val() == "" || $("#pVersion").val() == "" || $("#pOwner").val() == "") {
    //     alertify.error('please fill the required fields.');
    // } else {
    // saveProcess(element);
    // $('#flow-chart-view-header').text($('#pName').val());
    // $("#overviewDiv").hide();
    $("#flowChartView").show();
    $("#docEditDiv").hide();
    $("#docViewDiv").hide();
    $("#bpmnEditDiv").hide();
    $("#processTextEditDiv").hide();
    $("#processTextView").hide();
    $("#bpmnViewDiv").hide();
    $(".active").removeClass("active");
    $("#flowChartView").addClass("active");
    $('#textEditor').removeClass("clicked");
    $('#bpmn').removeClass("clicked");
    $('#flowChart').addClass("clicked");
    $('#doc').removeClass("clicked");

    if(($("#flowchartAvailableCheck").val() === "true") && !$('#flowChart').hasClass("fw-check")) {
        flowchartPath = "/_system/governance/" + flowchartPath;
        $.ajax({
            url: '/designer/assets/process/apis/get_process_flowchart',
            type: 'GET',
            dataType: 'text',
            data: {'flowchartPath': flowchartPath},
            success: function (data) {
                var response = JSON.parse(data);
                if (response.error === false) {
                    _loadEditableFlowChart(response.content, '#editor_canvas');
                } else {
                    alertify.error(response.content);
                }
            },
            error: function () {
                alertify.error('Error retrieving flowchart');
            }
        });

        $("#flowchartAvailableCheck").val("false");
    }

    //}
}

// function saveEditedFlowchart() {
//     ($("#flowchartAvailableCheck").val() === "true"){
//         _saveEditedFlowchart();
//     } else {
//         _saveFlowchart();
//     }
//     $("#flowChartView").hide();
//     $("#flowchartadded").addClass("fw fw-check");
// }
